import React from 'react';
import { ChefHat, ArrowRight, Utensils, Star, MapPin, Clock, Phone, Instagram, Facebook, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/initialData';

interface LandingPageProps {
  currentLang: Language;
  onLanguageToggle: (lang: Language) => void;
}

export default function LandingPage({ currentLang, onLanguageToggle }: LandingPageProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Public Header */}
      <header className="relative z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center bg-slate-900 shadow-lg shadow-amber-500/10">
              <ChefHat className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xl font-serif text-white tracking-tight font-bold">
              Manna <span className="text-amber-500 italic">Arusha</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
              <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
              <a href="#specialties" className="hover:text-amber-500 transition-colors">Specialties</a>
              <a href="#visit" className="hover:text-amber-500 transition-colors">Visit Us</a>
            </nav>
            
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button onClick={() => onLanguageToggle('en')} className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${currentLang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>EN</button>
              <button onClick={() => onLanguageToggle('sw')} className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${currentLang === 'sw' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'}`}>SW</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {currentLang === 'en' ? 'Arusha\'s Premier Digital Dining' : 'Mgahawa wa Kisasa wa Kidijitali Arusha'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
              Experience the True Taste of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">Tanzania</span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {currentLang === 'en' 
                ? 'From world-class Nyama Choma to our signature local dishes, Manna Restaurant blends authentic flavors with seamless digital ordering right from your table.' 
                : 'Kuanzia Nyama Choma tamu hadi vyakula vyetu vya asili, Manna Restaurant inachanganya ladha halisi na urahisi wa kuagiza kidijitali moja kwa moja mezani kwako.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link 
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                <Utensils className="w-4 h-4" />
                {currentLang === 'en' ? 'Explore Our Menu' : 'Tazama Menyu Yetu'}
              </Link>
              <a 
                href="#visit"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3"
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                {currentLang === 'en' ? 'Find Us in Arusha' : 'Tupatikane Arusha'}
              </a>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="about" className="py-24 bg-slate-900/40 border-y border-slate-800/60 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Star,
                title: currentLang === 'en' ? 'Authentic Recipes' : 'Mapishi Halisi',
                desc: currentLang === 'en' ? 'Locally sourced ingredients prepared by expert Tanzanian chefs.' : 'Viungo asili vilivyoandaliwa na wapishi mahiri wa Kitanzania.'
              },
              {
                icon: ChefHat,
                title: currentLang === 'en' ? 'Digital Ordering' : 'Oda za Kidijitali',
                desc: currentLang === 'en' ? 'Scan the QR code on your table, order from your phone, and relax.' : 'Scan QR code mezani kwako, agiza kwa simu, na utulie.'
              },
              {
                icon: Utensils,
                title: currentLang === 'en' ? 'Fast & Fresh' : 'Haraka na Moto',
                desc: currentLang === 'en' ? 'Our modern kitchen display system ensures your food arrives hot.' : 'Mfumo wetu wa kisasa jikoni unahakikisha chakula kinafika cha moto.'
              }
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shadow-inner">
                  <feature.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-serif text-white">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="visit" className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
              {currentLang === 'en' ? 'Ready to dine with us?' : 'Upo tayari kula nasi?'}
            </h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto">
              {currentLang === 'en' ? 'Join us at Manna Restaurant in Arusha for an unforgettable culinary experience.' : 'Karibu Manna Restaurant Arusha kwa uzoefu wa chakula usioweza kusahaulika.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
              <div className="flex flex-col items-center gap-2 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                <MapPin className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-sm font-bold text-white">Central Arusha</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Tanzania</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                <Clock className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-sm font-bold text-white">10:00 AM - 11:00 PM</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Daily</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                <Phone className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-sm font-bold text-white">+255 754 000 000</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Reservations</span>
              </div>
            </div>

            <Link 
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-200 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs transition-transform transform hover:-translate-y-1"
            >
              {currentLang === 'en' ? 'Browse Digital Menu' : 'Tazama Menyu yetu'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500">
            <ChefHat className="w-5 h-5" />
            <span className="font-serif italic font-bold">Manna Arusha</span>
            <span className="text-xs ml-2">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            <Link to="/login" className="hover:text-amber-500 transition-colors uppercase tracking-widest font-bold">
              Staff Access Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
