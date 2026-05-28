import React, { useMemo, useState, useEffect } from 'react';
import { ChefHat, Search, Utensils, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { TRANSLATIONS } from '../constants/initialData';
import { Link } from 'react-router-dom';

interface PublicMenuProps {
  currentLang: Language;
  onLanguageToggle: (lang: Language) => void;
}

export default function PublicMenu({ currentLang, onLanguageToggle }: PublicMenuProps) {
  const t = TRANSLATIONS[currentLang];
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        // Only show available items on public menu
        setMenu(data.filter((item: MenuItem) => item.isAvailable));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchSearch =
        item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameSw.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [menu, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 overflow-hidden flex items-center justify-center bg-slate-950">
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif italic text-amber-500 tracking-tight font-semibold">
                Manna
              </h1>
              <span className="p-0.5 px-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded text-[9px] font-mono uppercase font-bold text-white tracking-widest mt-0.5 select-none">
                Arusha
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">
              Public Menu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> System Access
          </Link>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onLanguageToggle('en')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentLang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageToggle('sw')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentLang === 'sw' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              SW
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full pb-24">
        {loading ? (
          <div className="w-full space-y-8 animate-pulse">
            <div className="h-32 bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-40 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-4xl font-serif text-white tracking-tight">{t.welcome}</h2>
              <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">{t.tagline}</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-1.5 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
                  {['all', 'food', 'drink'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all duration-300 ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? t.allCategories : cat}
                    </button>
                  ))}
                </div>

                <div className="relative group max-w-xs w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-amber-500" />
                  <input
                    type="text"
                    placeholder={t.searchFoodPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/40 transition-all placeholder:text-slate-600 shadow-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMenu.length > 0 ? (
                  filteredMenu.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800/40 hover:border-amber-500/20 rounded-[2rem] p-4 transition-all duration-500"
                    >
                      <div className="flex flex-col h-full gap-4">
                        <div className="w-full h-40 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-amber-500/10 transition-colors overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Utensils className="w-12 h-12 text-amber-500/10 group-hover:text-amber-500/20 transition-all duration-500 transform group-hover:scale-110" />
                          <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-800 text-xs font-mono font-bold text-amber-500">
                            {item.price.toLocaleString()} <span className="opacity-60 text-[10px]">{t.tzs}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col px-1 pb-2">
                          <h4 className="text-base font-bold text-slate-200 font-sans group-hover:text-amber-500 transition-colors line-clamp-1">
                            {currentLang === 'en' ? item.nameEn : item.nameSw}
                          </h4>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {currentLang === 'en' ? item.descEn : item.descSw}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-850">
                      <Search className="w-6 h-6 text-slate-700" />
                    </div>
                    <p className="text-slate-500 text-sm italic">
                      {currentLang === 'en' ? `No dishes found` : `Hakuna chakula`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
