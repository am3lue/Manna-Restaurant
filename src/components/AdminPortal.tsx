import React, { useState, useMemo } from 'react';
import { DollarSign, BookOpen, Layers, Edit, Plus, Trash2, TrendingUp, BarChart2, ShieldAlert, ShoppingBag, Clock, CheckCircle, ArrowRight, X, Save, AlertCircle } from 'lucide-react';
import { MenuItem, Order, Language } from '../types';
import { TRANSLATIONS } from '../constants/initialData';

interface AdminPortalProps {
  currentLang: Language;
  menu: MenuItem[];
  orders: Order[];
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'isAvailable'>) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onToggleAvailability: (id: string, isAvailable: boolean) => void;
  onMarkServed?: (orderId: string) => void;
  onMarkPaid?: (orderId: string) => void;
}

export default function AdminPortal({
  currentLang,
  menu,
  orders,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onToggleAvailability,
  onMarkServed,
  onMarkPaid
}: AdminPortalProps) {
  const t = TRANSLATIONS[currentLang];

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameSw, setFormNameSw] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescSw, setFormDescSw] = useState('');
  const [formPrice, setFormPrice] = useState<number>(3500);
  const [formCategory, setFormCategory] = useState<'food' | 'drink' | 'sides' | 'specials'>('food');
  const [formStockCount, setFormStockCount] = useState<number>(-1);

  const activeOrdersList = useMemo(() => {
    return orders.filter(o => o.status !== 'paid');
  }, [orders]);

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const activeOrders = orders.filter(o => ['pending', 'cooking', 'ready', 'served'].includes(o.status)).length;
    const outOfStock = menu.filter(m => !m.isAvailable).length;
    return { totalSales, activeOrders, avgPrep: '11.4 min', outOfStock };
  }, [orders, menu]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMenuItem({
      nameEn: formNameEn,
      nameSw: formNameSw,
      descEn: formDescEn,
      descSw: formDescSw,
      price: formPrice,
      category: formCategory,
      stockCount: formStockCount
    });
    resetForm();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onUpdateMenuItem({
      ...editingItem,
      nameEn: formNameEn,
      nameSw: formNameSw,
      descEn: formDescEn,
      descSw: formDescSw,
      price: formPrice,
      category: formCategory,
      stockCount: formStockCount
    });
    resetForm();
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormNameEn(item.nameEn);
    setFormNameSw(item.nameSw);
    setFormDescEn(item.descEn);
    setFormDescSw(item.descSw);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormStockCount(item.stockCount !== undefined ? item.stockCount : -1);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setFormNameEn('');
    setFormNameSw('');
    setFormDescEn('');
    setFormDescSw('');
    setFormPrice(3500);
    setFormCategory('food');
    setFormStockCount(-1);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t.totalSales, val: stats.totalSales.toLocaleString(), unit: 'TZS', icon: DollarSign, color: 'text-amber-500' },
          { label: t.pendingOrders, val: stats.activeOrders, unit: 'Active', icon: Layers, color: 'text-white' },
          { label: 'Out of Stock', val: stats.outOfStock, unit: 'Alert', icon: AlertCircle, color: stats.outOfStock > 0 ? 'text-rose-500' : 'text-slate-500' },
          { label: t.avgPreparationTime, val: stats.avgPrep, unit: '', icon: TrendingUp, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <div key={i} className="group bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500 hover:bg-slate-900/60">
            <div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
              <p className={`text-2xl font-mono font-black mt-1 tracking-tight ${stat.color}`}>
                {stat.val} <span className="text-[10px] font-bold font-sans text-slate-600 uppercase">{stat.unit}</span>
              </p>
            </div>
            <div className={`p-3 bg-slate-950 rounded-2xl border border-slate-800`}>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Active Floor Control */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <BarChart2 className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-serif text-white tracking-wide">Live Floor Control</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeOrdersList.length > 0 ? (
              activeOrdersList.map((order) => (
                <div key={order.id} className="group bg-slate-900/40 border border-slate-800/60 rounded-[2rem] p-6 transition-all duration-500 hover:bg-slate-900/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-xl font-serif text-amber-500 group-hover:border-amber-500/20 transition-colors">
                        T{order.tableId}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-500 font-mono uppercase">#{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            order.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">{order.customerName}</h4>
                        <p className="text-xs font-mono text-amber-500/80">{order.totalAmount.toLocaleString()} TZS</p>
                        
                        {/* Explicitly state what is cooking for Admin Oversight */}
                        {order.status === 'cooking' && (
                          <div className="mt-2 pt-2 border-t border-slate-800/50">
                            <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest block mb-1">Currently Cooking:</span>
                            <div className="flex flex-wrap gap-1">
                              {order.items.map((item, idx) => (
                                <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-800">
                                  <span className="text-amber-500 font-black mr-1">{item.quantity}x</span>
                                  {currentLang === 'en' ? item.nameEn : item.nameSw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {order.status === 'ready' && onMarkServed && (
                        <button
                          onClick={() => onMarkServed(order.id)}
                          className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                        >
                          Mark Served
                        </button>
                      )}
                      {order.status === 'served' && onMarkPaid && (
                        <button
                          onClick={() => onMarkPaid(order.id)}
                          className="flex-1 sm:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                        >
                          Settle & Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4 opacity-40">
                <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">No Active Orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu & Catalog */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-xl font-serif text-white tracking-wide">{t.menuManagement}</h3>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {showAddForm && (
            <div className="bg-slate-950 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-serif text-white">{editingItem ? 'Edit Item' : 'New Dish'}</h4>
                <button onClick={resetForm} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={editingItem ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Name (EN)" value={formNameEn} onChange={e => setFormNameEn(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                  <input required placeholder="Jina (SW)" value={formNameSw} onChange={e => setFormNameSw(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                </div>
                <textarea placeholder="Description (EN)" value={formDescEn} onChange={e => setFormDescEn(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white h-20" />
                <textarea placeholder="Maelezo (SW)" value={formDescSw} onChange={e => setFormDescSw(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white h-20" />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="number" required placeholder="Price TZS" value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono" />
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value as any)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white">
                    <option value="food">Food</option>
                    <option value="drink">Drink</option>
                    <option value="sides">Sides</option>
                    <option value="specials">Specials</option>
                  </select>
                  <input type="number" placeholder="Stock (-1 = Unltd)" value={formStockCount} onChange={e => setFormStockCount(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono" />
                </div>

                <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-3.5 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editingItem ? 'Update Database' : 'Save to Menu'}
                </button>
              </form>
            </div>
          )}

          <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] overflow-hidden divide-y divide-slate-800/40 backdrop-blur-sm">
            {menu.map((item) => (
              <div key={item.id} className={`group p-6 flex items-center justify-between transition-all hover:bg-slate-900/60 ${!item.isAvailable ? 'bg-rose-950/80' : ''}`}>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center ${!item.isAvailable ? 'text-rose-500 border-rose-500/50' : 'text-amber-500/20'}`}>
                    {item.isAvailable ? <DollarSign className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold font-sans ${!item.isAvailable ? 'text-rose-300' : 'text-slate-100'}`}>
                      {currentLang === 'en' ? item.nameEn : item.nameSw}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                      {item.price.toLocaleString()} TZS • {item.category} • {item.stockCount !== -1 ? `${item.stockCount} Portions` : 'Unlimited'}
                      {!item.isAvailable && <span className="ml-2 text-rose-500 font-black tracking-normal">OUT OF STOCK</span>}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="p-2 rounded-xl text-slate-600 hover:bg-slate-950 hover:text-amber-500 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteMenuItem(item.id)} className="p-2 rounded-xl text-slate-600 hover:bg-slate-950 hover:text-rose-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
