import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingBag, CheckCircle, Clock, Utensils, Shield, QrCode, 
  ChevronRight, MapPin, CreditCard, User, MessageSquare, AlertCircle
} from 'lucide-react';
import { MenuItem, CartItem, Order, Language, Table } from '../types';
import { TRANSLATIONS } from '../constants/initialData';

interface CustomerPortalProps {
  currentLang: Language;
  menu: MenuItem[];
  tables: Table[];
  activeOrder: Order | null;
  onPlaceOrder: (items: CartItem[], notes: string, tableId: string, payMethod: 'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Cash') => void;
}

export default function CustomerPortal({
  currentLang,
  menu,
  tables,
  activeOrder,
  onPlaceOrder
}: CustomerPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('1');
  const [customerName, setCustomerName] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Cash'>('Cash');
  const [addedPopupId, setAddedPopupId] = useState<string | null>(null);
  const [showSimulatePayMsg, setShowSimulatePayMsg] = useState(false);

  const t = TRANSLATIONS[currentLang];

  // Filters
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchSearch =
        item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameSw.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchSearch && matchCategory && item.isAvailable;
    });
  }, [menu, searchTerm, selectedCategory]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });
    
    setAddedPopupId(item.id);
    setTimeout(() => setAddedPopupId(null), 800);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.menuItem.id === id) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert(currentLang === 'en' ? 'Please enter your name!' : 'Tafadhali weka jina lako!');
      return;
    }

    const compiledNotes = `${customerName.trim()} - Notes: ${specialNotes}`;
    onPlaceOrder(cart, compiledNotes, selectedTableId, paymentMethod);
    setCart([]);
    setSpecialNotes('');
    if (paymentMethod !== 'Cash') {
      setShowSimulatePayMsg(true);
      setTimeout(() => setShowSimulatePayMsg(false), 8000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-700">
      
      {/* Left Column: Menu & Search */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner">
                <QrCode className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-3xl font-serif text-white tracking-tight leading-none mb-2">
                  {t.welcome}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide">
                  <MapPin className="w-3 h-3 text-amber-500/60" />
                  <span>{t.qrOrdering} • {t.tableNumber} {selectedTableId}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
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
          </div>

          <div className="relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-amber-500" />
            <input
              type="text"
              placeholder={t.searchFoodPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl pl-11 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/40 transition-all placeholder:text-slate-600 shadow-xl"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800/40 hover:border-amber-500/20 rounded-[2rem] p-4 transition-all duration-500"
              >
                <div className="flex flex-col h-full gap-4">
                  <div className="w-full h-32 bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:border-amber-500/10 transition-colors overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Utensils className="w-10 h-10 text-amber-500/10 group-hover:text-amber-500/20 transition-all duration-500 transform group-hover:scale-110" />
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-amber-500">
                      {item.price.toLocaleString()} <span className="opacity-60">{t.tzs}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between px-1">
                    <div>
                      <h4 className="text-sm font-bold text-slate-200 font-sans group-hover:text-amber-500 transition-colors line-clamp-1">
                        {currentLang === 'en' ? item.nameEn : item.nameSw}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {currentLang === 'en' ? item.descEn : item.descSw}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => addToCart(item)}
                      className={`w-full mt-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                        addedPopupId === item.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-amber-500 hover:text-slate-950 shadow-lg hover:shadow-amber-500/10'
                      }`}
                    >
                      {addedPopupId === item.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          {t.addedToCart}
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {t.addToCart}
                        </>
                      )}
                    </button>
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

      {/* Right Column: Checkout & Tracking */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
        
        {/* Checkout Card */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/10" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white tracking-wide">{t.cart}</h3>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {cart.length} {currentLang === 'en' ? 'Items' : 'Vyakula'}
                </span>
              </div>
            </div>

            {cart.length > 0 ? (
              <form onSubmit={handleOrderSubmit} className="space-y-8">
                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="flex items-center gap-4 p-4 bg-slate-950/40 rounded-3xl border border-slate-800/30 group/item hover:border-amber-500/20 transition-all">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 font-mono text-sm font-black shrink-0 border border-slate-800 group-hover/item:border-amber-500/30">
                        {item.quantity}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate group-hover/item:text-amber-500 transition-colors">
                          {currentLang === 'en' ? item.menuItem.nameEn : item.menuItem.nameSw}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {(item.menuItem.price * item.quantity).toLocaleString()} {t.tzs}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => updateCartQty(item.menuItem.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-all border border-slate-800 hover:border-red-500/30"
                        >
                          -
                        </button>
                        <button 
                          type="button"
                          onClick={() => updateCartQty(item.menuItem.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 text-slate-500 hover:bg-amber-500/20 hover:text-amber-500 transition-all border border-slate-800 hover:border-amber-500/30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-800/60">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                        placeholder={t.enterName}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                      </div>
                      <textarea
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all h-24 resize-none"
                        placeholder={t.specialInstructionsDesc}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {(['M-Pesa', 'Cash'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                            paymentMethod === method
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5'
                              : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-300'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex justify-between items-end px-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Total Bill</span>
                      <span className="text-2xl font-serif text-amber-500 font-medium">
                        {cartTotal.toLocaleString()} <span className="text-[10px] uppercase tracking-normal opacity-60 ml-0.5">{t.tzs}</span>
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-[1.5rem] shadow-2xl shadow-amber-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 text-xs uppercase tracking-widest"
                    >
                      {t.placeOrder}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-slate-800/50 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <ShoppingBag className="w-8 h-8 text-slate-800" />
                </div>
                <div className="space-y-2 px-8">
                  <p className="text-sm font-bold text-slate-400 leading-relaxed">
                    {t.cartEmpty}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">
                    Arusha Digital Dining
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        {activeOrder && (
          <div className="bg-slate-900/40 border border-emerald-500/10 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-right-8 duration-700 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Clock className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-widest uppercase">{t.trackOrderStatus}</h3>
                <p className="text-[10px] text-emerald-500/60 font-mono mt-0.5">Order ID: #{activeOrder.id}</p>
              </div>
            </div>

            <div className="space-y-8 relative">
              {[
                { key: 'pending', label: t.orderReceived, icon: Shield },
                { key: 'cooking', label: t.orderCooking, icon: Utensils },
                { key: 'ready', label: t.orderReady, icon: ShoppingBag },
                { key: 'served', label: t.orderServed, icon: CheckCircle },
              ].map((step, idx, arr) => {
                const isCompleted = arr.findIndex(s => s.key === activeOrder.status) >= idx;
                const isCurrent = activeOrder.status === step.key;

                return (
                  <div key={step.key} className="relative flex items-center gap-6 group">
                    {idx !== arr.length - 1 && (
                      <div className={`absolute left-[15px] top-8 w-[2px] h-8 transition-colors duration-700 ${isCompleted ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
                    )}
                    <div className={`z-10 w-8 h-8 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-700'
                    }`}>
                      <step.icon className={`w-4 h-4 ${isCurrent ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-black tracking-widest uppercase transition-colors duration-700 ${
                        isCompleted ? 'text-emerald-400' : 'text-slate-600'
                      }`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] text-slate-400 font-medium animate-pulse">
                          {currentLang === 'en' ? 'Processing live...' : 'Inashughulikiwa sasa...'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showSimulatePayMsg && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-amber-500 text-slate-950 px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-6 border border-amber-400/50 backdrop-blur-xl">
            <div className="w-10 h-10 bg-slate-950/10 rounded-2xl flex items-center justify-center animate-spin">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.tanzaniaMobilePay}</p>
              <p className="text-xs font-bold opacity-80">{t.paySuccessMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
