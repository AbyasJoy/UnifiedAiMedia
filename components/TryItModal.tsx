import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Sparkles, Loader2, Copy, Check, StopCircle, RefreshCw, Image as ImageIcon, Mail, Type as TypeIcon, Share2, Download } from 'lucide-react';
import { Button } from './Button';
import { GoogleGenAI, Type, Schema } from "@google/genai";

interface TryItModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeneratedAssets {
  invitation: { subject: string; body: string };
  captions: string[];
  socialPost: { headline: string; visualDescription: string; body: string; cta: string };
  imagePrompt: string;
  socialImagePrompt: string;
  posterImage?: string;
  socialImage?: string;
}

export const UnifiedGeneratorModal: React.FC<TryItModalProps> = ({ isOpen, onClose }) => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Results State
  const [results, setResults] = useState<GeneratedAssets | null>(null);
  const [activeTab, setActiveTab] = useState<'invite' | 'captions' | 'social'>('invite');
  const [copied, setCopied] = useState<string | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTextInput('');
      setResults(null);
      setIsRecording(false);
      setIsTranscribing(false);
      setActiveTab('invite');
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    if (!textInput.trim()) return;
    if (!import.meta.env.VITE_API_KEY) {
        alert("API Key is missing. Please ensure VITE_API_KEY is available in your .env file.");
        return;
    }

    setIsGenerating(true);
    setResults(null);

    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
        
        // 1. Configure Schema for Strict JSON Output
        const jsonSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            invitation: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING, description: "A catchy email subject line for the event." },
                body: { type: Type.STRING, description: "The full invitation email text. MUST include Date, Time, and Location. If user didn't provide these, invent plausible ones." }
              },
              required: ["subject", "body"]
            },
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Short, punchy social media caption." }
            },
            socialPost: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING, description: "A short attention-grabbing headline." },
                visualDescription: { type: Type.STRING, description: "A description of what the image/video should look like." },
                body: { type: Type.STRING, description: "A complete Instagram-ready caption. It MUST include emojis 🌟 and a block of 5-10 hashtags # at the end." },
                cta: { type: Type.STRING, description: "A clear Call to Action (e.g., 'Link in bio', 'Register now')." }
              },
              required: ["headline", "visualDescription", "body", "cta"]
            },
            imagePrompt: { 
                type: Type.STRING, 
                description: "A detailed prompt for the main event poster. IT MUST EXPLICITLY INSTRUCT TO RENDER THE TEXT: Event Title, Date, and Location. Example: 'A neon cyberpunk poster with the text \"NEON NIGHTS\" and \"OCT 24\" written in bold glowing letters in the center'." 
            },
            socialImagePrompt: { 
                type: Type.STRING, 
                description: "A prompt for a Social Media Square Image (1:1). It must use the same color palette and theme as the poster but MUST HAVE A DIFFERENT BACKGROUND and FONT STYLE. Example: If poster has a complex city scene, make this one a clean abstract pattern with the same colors. The text style should also differ (e.g. minimalist vs bold) to look like a fresh 'remix' for Instagram." 
            }
          },
          required: ["invitation", "captions", "socialPost", "imagePrompt", "socialImagePrompt"]
        };

        const systemPrompt = `You are an expert Social Media Manager and Event Planner. 
        Your task is to take a user's rough event idea and turn it into a polished marketing package.

        CRITICAL INSTRUCTIONS:
        1. **Text Rendering**: For 'imagePrompt' and 'socialImagePrompt', you MUST include instructions to render the specific text of the event (Title and Date). If the user didn't provide a title, invent a cool one.
        2. **Visual Remix**: The 'socialImagePrompt' MUST be a variation of the poster. 
           - **Background**: Change the background complexity. If the poster is busy, make the social post cleaner/simpler or use a different pattern.
           - **Typography**: Request a different font style (e.g., 'sleek modern sans-serif' vs 'bold retro').
           - **Vibe**: Keep the core brand colors so it feels related, but make it distinct enough to be interesting.
        3. **Instagram Post**: The 'socialPost.body' must be written specifically for Instagram with emojis and hashtags.
        4. **Missing Details**: Invent plausible Date/Time/Location if missing.
        `;

        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User Event Description: ${textInput}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: jsonSchema
            }
        });

        if (!textResponse.text) throw new Error("Failed to generate text plan.");
        
        let parsedData: GeneratedAssets;
        try {
            parsedData = JSON.parse(textResponse.text);
        } catch (e) {
            console.error("JSON Parse Error", e);
            const cleanText = textResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleanText);
        }
        
        // 2. Generate Images in Parallel (Poster & Social Image)
        const generateImage = async (prompt: string, aspectRatio: "3:4" | "1:1") => {
            try {
                const imageResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: prompt }] },
                    config: {
                        imageConfig: { aspectRatio: aspectRatio }
                    }
                });
                if (imageResponse.candidates?.[0]?.content?.parts) {
                    for (const part of imageResponse.candidates[0].content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            return `data:image/png;base64,${part.inlineData.data}`;
                        }
                    }
                }
            } catch (error) {
                console.error(`Image generation failed for ${aspectRatio}`, error);
            }
            return undefined;
        };

        const [posterUrl, socialUrl] = await Promise.all([
            generateImage(parsedData.imagePrompt, "3:4"),    // Poster (Portrait)
            generateImage(parsedData.socialImagePrompt, "1:1") // Social (Square)
        ]);

        setResults({ 
            ...parsedData, 
            posterImage: posterUrl,
            socialImage: socialUrl
        });

    } catch (error) {
        console.error("Generation error:", error);
        alert("Something went wrong while creating your assets. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = ''; 

        const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
            transcribeAudio();
        };

        mediaRecorder.start();
        setIsRecording(true);
    } catch (err) {
        alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }
  };

  const transcribeAudio = async () => {
      if (audioChunksRef.current.length === 0) return;
      setIsTranscribing(true);
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            const mimeType = base64String.split(';')[0].split(':')[1];
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: mimeType, data: base64Data } },
                        { text: "Transcribe the speech exactly." }
                    ]
                }
            });
            if (response.text) {
                setTextInput(prev => (prev ? prev + ' ' : '') + response.text.trim());
            }
            setIsTranscribing(false);
        };
      } catch (error) {
          setIsTranscribing(false);
      }
  };

  const handleCopy = (text: string, id: string) => {
      navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] animate-in fade-in zoom-in duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none">Unified AI Generator</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">One prompt. Full event package.</p>
                </div>
            </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8">
            {!results ? (
                <div className="max-w-2xl mx-auto space-y-8 py-8 flex flex-col justify-center h-full">
                    <div className="text-center space-y-2 mb-4">
                        <h2 className="text-3xl font-bold text-slate-900">What are you planning?</h2>
                        <p className="text-slate-500">Describe your event (Title, Date, Time, Location) and we'll generate the poster, invites, and social posts instantly.</p>
                    </div>

                    <div className="relative group bg-white p-2 rounded-3xl shadow-sm border border-slate-200 transition-all focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-500">
                        <textarea 
                            className="w-full h-48 p-4 bg-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400 text-lg leading-relaxed font-body"
                            placeholder="E.g., A futuristic 'Neon Nights' launch party for our new AI startup next Friday at 8PM at the Skyline Loft. Dress code is Cyberpunk. We need cool vibes..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            disabled={isTranscribing}
                        ></textarea>
                        
                        <div className="flex justify-between items-center px-4 pb-2">
                             <span className="text-xs font-medium text-slate-400">
                                {isRecording ? <span className="text-rose-500 animate-pulse">Recording...</span> : isTranscribing ? <span className="text-brand-500">Transcribing...</span> : "Type or use voice"}
                             </span>
                             <button 
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isTranscribing}
                                className={`p-3 rounded-full transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button 
                        className="w-full shadow-xl shadow-brand-500/20 py-4 text-lg" 
                        size="lg" 
                        onClick={handleGenerate}
                        disabled={!textInput.trim() || isGenerating || isRecording || isTranscribing}
                    >
                        {isGenerating ? (
                            <><Loader2 className="mr-2 animate-spin" /> Creating your assets...</>
                        ) : (
                            <><Sparkles className="mr-2" /> Generate All Assets</>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Left: Poster Visualization */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full max-h-[600px] lg:sticky lg:top-0">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-brand-500" /> Event Poster
                            </h4>
                            <div className="flex-1 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative group min-h-[400px]">
                                {results.posterImage ? (
                                    <img src={results.posterImage} alt="Event Poster" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-slate-400 text-sm flex flex-col items-center">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <span>Image generation unavailable</span>
                                    </div>
                                )}
                                {results.posterImage && (
                                    <a 
                                        href={results.posterImage} 
                                        download="poster.png" 
                                        className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-700 cursor-pointer"
                                    >
                                        <Download size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Text Content Tabs */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                            {[
                                { id: 'invite', icon: Mail, label: 'Invitation' },
                                { id: 'captions', icon: TypeIcon, label: 'Captions' },
                                { id: 'social', icon: Share2, label: 'Social Plan' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-white text-brand-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
                            {/* Invitation Tab */}
                            {activeTab === 'invite' && results.invitation && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Subject Line</div>
                                            <div className="font-medium text-slate-900 text-lg">{results.invitation.subject}</div>
                                        </div>
                                        <button onClick={() => handleCopy(results.invitation.subject, 'subj')} className="text-slate-400 hover:text-brand-600">
                                            {copied === 'subj' ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                    
                                    <div className="h-px bg-slate-100 w-full"></div>

                                    <div className="relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleCopy(results.invitation.body, 'body')} className="p-2 bg-slate-100 hover:bg-brand-50 rounded-lg text-slate-500 hover:text-brand-600">
                                                {copied === 'body' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Email Body</div>
                                        <div className="whitespace-pre-wrap text-slate-600 leading-relaxed font-mono text-sm bg-slate-50 p-4 rounded-xl">
                                            {results.invitation.body}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Captions Tab */}
                            {activeTab === 'captions' && results.captions && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {results.captions.map((caption, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors group relative">
                                            <div className="pr-10 text-slate-700 leading-relaxed">{caption}</div>
                                            <button 
                                                onClick={() => handleCopy(caption, `cap-${idx}`)}
                                                className="absolute top-4 right-4 text-slate-300 group-hover:text-brand-600 transition-colors"
                                            >
                                                {copied === `cap-${idx}` ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Social Tab */}
                            {activeTab === 'social' && results.socialPost && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {/* New Social Media Image Section */}
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <div className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <ImageIcon size={14} /> Generated Post Image (1:1)
                                        </div>
                                        <div className="aspect-square w-full max-w-[300px] mx-auto bg-slate-200 rounded-lg overflow-hidden relative group shadow-sm">
                                            {results.socialImage ? (
                                                <img src={results.socialImage} alt="Social Media Post" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading visual...</div>
                                            )}
                                            {results.socialImage && (
                                                <a 
                                                    href={results.socialImage} 
                                                    download="social-post.png" 
                                                    className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-700 cursor-pointer"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-center text-slate-400">Optimized for Instagram Feed</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl">
                                            <div className="text-xs text-slate-500 font-bold mb-1">Headline Hook</div>
                                            <div className="font-semibold text-slate-900">{results.socialPost.headline}</div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl">
                                            <div className="text-xs text-slate-500 font-bold mb-1">Call to Action</div>
                                            <div className="font-semibold text-brand-600">{results.socialPost.cta}</div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold mb-2">Visual Direction Used</div>
                                        <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm italic border border-amber-100">
                                            🎨 {results.socialImagePrompt}
                                        </div>
                                    </div>

                                    <div className="relative group">
                                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleCopy(results.socialPost.body, 'social-body')} className="p-2 bg-slate-100 hover:bg-brand-50 rounded-lg text-slate-500 hover:text-brand-600">
                                                {copied === 'social-body' ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                        <div className="text-xs text-slate-500 font-bold mb-2">Instagram Caption</div>
                                        <div className="whitespace-pre-wrap text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl font-body">
                                            {results.socialPost.body}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {results && (
                <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="ghost" onClick={() => setResults(null)}>
                        <RefreshCw size={18} className="mr-2" /> Start Over
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};