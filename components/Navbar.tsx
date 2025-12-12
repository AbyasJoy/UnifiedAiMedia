import React, { useState, useEffect } from 'react';
import { Menu, X, Mic } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onOpenModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'Features', href: '#features' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="bg-gradient-to-br from-brand-500 to-accent-600 text-white p-2.5 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Mic size={22} className="fill-white/20" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Unified<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">AI</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href.substring(1))}
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors cursor-pointer text-sm"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" onClick={onOpenModal}>Get Started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-700 hover:text-brand-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-lg font-medium text-slate-700 py-3 border-b border-slate-50 cursor-pointer"
              onClick={(e) => handleNavClick(e, link.href.substring(1))}
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full mt-2" onClick={() => { onOpenModal(); setIsMobileMenuOpen(false); }}>
            Get Started
          </Button>
        </div>
      )}
    </nav>
  );
};