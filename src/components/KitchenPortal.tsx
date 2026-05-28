import React, { useMemo, useState } from 'react';
import { ChefHat, Flame, ThumbsUp, HelpCircle, Inbox, Clock, CheckCircle, Timer, AlertTriangle, Box, PackageX, PackageCheck, Search } from 'lucide-react';
import { Order, Language, MenuItem } from '../types';
import { TRANSLATIONS } from '../constants/initialData';

interface KitchenPortalProps {
  currentLang: Language;
  orders: Order[];
  menu: MenuItem[];
  onBumpCooking: (orderId: string) => void;
  onBumpReady: (orderId: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

export default function KitchenPortal({
  currentLang,
  orders,
  menu,
  onBumpCooking,
  onBumpReady,
  onToggleAvailability
}: KitchenPortalProps) {
  const t = TRANSLATIONS[currentLang];
  const [showStockManager, setShowStockManager] = useState(false);
  const [stockSearch, setStockSearch] = useState('');

  const kitchenTickets = useMemo(() => {
    return orders
      .filter((o) => ['pending', 'cooking'].includes(o.status))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [orders]);

  const filteredStock = useMemo(() => {
    return menu.filter(item => 
      item.nameEn.toLowerCase().includes(stockSearch.toLowerCase()) ||
      item.nameSw.toLowerCase().includes(stockSearch.toLowerCase())
    );
  }, [menu, stockSearch]);

  const getTicketPriority = (order: Order) => {
    const hasSpecials = order.items.some(it => ['m1', 'm3'].includes(it.menuItemId));
    const timeInQueueMs = Date.now() - new Date(order.createdAt).getTime();
    const minutesInQueue = Math.floor(timeInQueueMs / 60000);
    
    if (minutesInQueue > 10 || hasSpecials) {
      return { label: t.priorityHigh, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', isHigh: true };
    }
    return { label: t.priorityNormal, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', isHigh: false };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* KDS Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/60 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <ChefHat className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif text-white tracking-tight">{t.kitchenPortalTitle}</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
            {currentLang === 'en' 
              ? 'Real-time kitchen display. Toggle stock status below if items run out.' 
              : 'Skrini ya jikoni. Badili hali ya upatikanaji wa chakula hapa chini.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowStockManager(!showStockManager)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${
              showStockManager 
                ? 'bg-amber-500 border-amber-500 text-slate-950' 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-4 h-4" />
            {currentLang === 'en' ? 'Stock Management' : 'Usimamizi wa Stoo'}
          </button>
          <div className="bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Feed</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-sm font-mono font-bold text-amber-500">{kitchenTickets.length} Tickets</span>
          </div>
        </div>
      </div>

      {/* Stock Management Overlay/Section */}
      {showStockManager && (
        <div className="bg-slate-950/50 border border-slate-800 rounded-[2.5rem] p-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-serif text-white">Inventory & Stock</h3>
            <div className="relative group flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items..."
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredStock.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  item.isAvailable 
                    ? 'bg-slate-900/40 border-slate-800/60' 
                    : 'bg-rose-950/80 border-rose-500/50'
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${item.isAvailable ? 'text-slate-200' : 'text-rose-300'}`}>
                    {currentLang === 'en' ? item.nameEn : item.nameSw}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-0.5">
                    {item.isAvailable ? (item.stockCount !== -1 ? `${item.stockCount} Portions` : 'In Stock') : 'Out of Stock'}
                  </p>
                </div>
                <button
                  onClick={() => onToggleAvailability(item.id, !item.isAvailable)}
                  className={`p-2 rounded-xl transition-all ${
                    item.isAvailable 
                      ? 'bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10' 
                      : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  }`}
                >
                  {item.isAvailable ? <PackageCheck className="w-4 h-4" /> : <PackageX className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Kitchen Tickets */}
      {kitchenTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitchenTickets.map((order) => {
            const priority = getTicketPriority(order);
            const timeDiff = Date.now() - new Date(order.createdAt).getTime();
            const minElapsed = Math.floor(timeDiff / (1000 * 60));

            return (
              <div
                key={order.id}
                className={`group relative flex flex-col bg-slate-900/40 border-2 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5 ${
                  order.status === 'cooking'
                    ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent'
                    : 'border-slate-800/60'
                }`}
              >
                <div className={`h-1.5 w-full ${order.status === 'cooking' ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`} />

                <div className="p-6 space-y-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest font-mono">#{order.id}</span>
                        {priority.isHigh && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
                      </div>
                      <h3 className="text-xl font-serif text-white leading-tight">Table {order.tableId}</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate max-w-[120px]">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${priority.color}`}>
                        {priority.label}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono font-bold text-slate-500">
                        <Timer className="w-3.5 h-3.5" />
                        {minElapsed}m
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/40 rounded-3xl p-5 border border-slate-800/40 space-y-4">
                    <div className="space-y-3 max-h-[30vh] overflow-y-auto no-scrollbar">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                            <span className="text-xs font-black text-amber-500 font-mono">{item.quantity}</span>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-xs font-bold text-slate-100 leading-tight">
                              {currentLang === 'en' ? item.nameEn : item.nameSw}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="pt-4 border-t border-slate-800/60">
                        <div className="flex items-center gap-2 mb-2">
                          <HelpCircle className="w-3 h-3 text-slate-500" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.itemNotes}</span>
                        </div>
                        <p className="text-[11px] text-amber-500/90 font-medium italic leading-relaxed">
                          "{order.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-slate-950/20 mt-auto border-t border-slate-800/40">
                  {order.status === 'pending' ? (
                    <button
                      onClick={() => onBumpCooking(order.id)}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-3 transform hover:-translate-y-1"
                    >
                      <Flame className="w-4 h-4 animate-bounce" /> {t.bumpCooking}
                    </button>
                  ) : (
                    <button
                      onClick={() => onBumpReady(order.id)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 transform hover:-translate-y-1"
                    >
                      <ThumbsUp className="w-4 h-4" /> {t.bumpReady}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-40">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border-2 border-dashed border-slate-800">
            <Inbox className="w-10 h-10 text-slate-700" />
          </div>
          <div className="text-center space-y-1">
            <h5 className="text-lg font-serif text-slate-400">{t.noOrders}</h5>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Manna Arusha KDS</p>
          </div>
        </div>
      )}
    </div>
  );
}
