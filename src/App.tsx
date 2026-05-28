import React, { useState, useEffect } from 'react';
import { 
  Menu, Globe, Info, Play, Bell, LayoutGrid, Terminal, Check, CheckCircle, 
  UtensilsCrossed, AlertCircle, Sparkles, ChefHat, Users, Layers, TrendingUp, LogOut
} from 'lucide-react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
  MenuItem, Table, Order, Language, UserRole, CartItem, OrderStatus 
} from './types';
import { INITIAL_MENU, INITIAL_TABLES } from './constants/initialData';
import CustomerPortal from './components/CustomerPortal';
import KitchenPortal from './components/KitchenPortal';
import AdminPortal from './components/AdminPortal';
import AuthPage from './components/AuthPage';
import PublicMenu from './components/PublicMenu';
import LandingPage from './components/LandingPage';

export default function App() {
  // Master state
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // Database state
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Sound feedback simulation visual trigger state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // API base URL (Vercel Serverless path)
  const API_URL = '/api';

  // Fetch initial data
  const fetchData = async () => {
    // Only fetch if logged in or on a route that requires data
    if (!activeRole && location.pathname !== '/menu') return;
    try {
      const [menuRes, tablesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/menu`),
        fetch(`${API_URL}/tables`),
        fetch(`${API_URL}/orders`)
      ]);

      if (!menuRes.ok || !tablesRes.ok || !ordersRes.ok) throw new Error("API Failure");

      const menuData = await menuRes.json();
      const tablesData = await tablesRes.json();
      const ordersData = await ordersRes.json();

      setMenu(menuData);
      setTables(tablesData);
      setOrders(ordersData);
      setNetworkError(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNetworkError(true);
    }
  };

  useEffect(() => {
    if (activeRole) {
      setLoading(true);
      fetchData().finally(() => setLoading(false));
      // Poll for updates every 5 seconds (Real-time strategy)
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [activeRole]);

  // Track customer's current active order on their active viewport
  const currentCustomerOrder = orders.find(
    o => ['pending', 'cooking', 'ready', 'served'].includes(o.status) && o.customerName && !o.customerName.includes('walk-in')
  ) || null;

  // 1. PLACE CUSTOMER ORDER
  const handlePlaceOrder = async (
    cartItems: CartItem[], 
    notes: string, 
    tableId: string, 
    payMethod: 'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Cash'
  ) => {
    const customerNameParsed = notes.split(' - Notes:')[0] || 'Web Order';
    const cleanNotes = notes.split(' - Notes:')[1] || '';
    const total = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerNameParsed,
          table_id: tableId,
          items: cartItems.map(item => ({
            menuItemId: item.menuItem.id,
            nameEn: item.menuItem.nameEn,
            nameSw: item.menuItem.nameSw,
            price: item.menuItem.price,
            quantity: item.quantity
          })),
          notes: cleanNotes,
          total_amount: total,
          payment_method: payMethod
        })
      });

      const result = await response.json();
      if (response.status === 400 && result.error) {
        alert(result.error); // Show out of stock error
      } else if (result.success) {
        triggerAlert(`🛎️ New Order from Table ${tableId}!`);
        fetchData();
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // 2. UPDATE ORDER STATUS (Unified)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status, version: order.version })
      });
      
      const result = await response.json();
      
      if (response.status === 409) {
        alert(result.error || "Order updated by another user.");
        fetchData(); // Force refresh to get latest status
      } else if (response.ok) {
        if (status === 'ready') triggerAlert(`🍳 Food Ready!`);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBumpCooking = (id: string) => updateOrderStatus(id, 'cooking');
  const handleBumpReady = (id: string) => updateOrderStatus(id, 'ready');
  const handleMarkServed = (id: string) => updateOrderStatus(id, 'served');
  const handleMarkPaid = (id: string) => updateOrderStatus(id, 'paid');

  // MENU CRUD HANDLERS
  const handleAddMenuItem = async (newItem: Omit<MenuItem, 'id' | 'isAvailable'>) => {
    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleUpdateMenuItem = async (updatedItem: MenuItem) => {
    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/menu?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isAvailable })
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  // Helper trigger sound visual flash effect
  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleLogin = (role: UserRole, name: string) => {
    localStorage.setItem('manna_role', role);
    localStorage.setItem('manna_user', name);
    setActiveRole(role);
    setUserName(name);
    if (role === 'customer') navigate('/customer');
    if (role === 'kitchen') navigate('/kitchen');
    if (role === 'manager') navigate('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('manna_role');
    localStorage.removeItem('manna_user');
    setActiveRole(null);
    setUserName('');
    navigate('/');
  };

  // Check if current route is a public route
  const isPublicRoute = ['/', '/menu', '/login'].includes(location.pathname);

  if (!activeRole && isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage currentLang={currentLang} onLanguageToggle={setCurrentLang} />} />
        <Route path="/menu" element={<PublicMenu currentLang={currentLang} onLanguageToggle={setCurrentLang} />} />
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
      </Routes>
    );
  }

  // If a user is not logged in and tries to access a protected route, redirect to login
  if (!activeRole && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center p-8">
        <div className="w-full max-w-7xl space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-20 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
          
          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-4">
               <div className="h-12 bg-slate-900 border border-slate-800 rounded-2xl w-3/4" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
                 ))}
               </div>
            </div>
            <div className="md:col-span-4">
               <div className="h-[60vh] bg-slate-900 border border-slate-800 rounded-3xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      
      {/* Network Error Banner */}
      {networkError && (
        <div className="bg-rose-500 text-white text-center py-1.5 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
          Connection Lost. Retrying...
        </div>
      )}

      {/* Alert Ribbon Floating Overlay */}
      {alertMessage && (
        <div className="fixed top-24 right-4 z-50 bg-amber-500 border border-amber-400 text-slate-950 px-5 py-3.5 rounded-xl shadow-2xl font-mono font-bold text-xs flex items-center gap-2.5 animate-bounce">
          <Bell className="w-5 h-5 text-slate-950" />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Top Professional Restaurant Banner */}
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
              <span className="p-0.5 px-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded text-[9px] font-mono uppercase font-bold text-white tracking-widest mt-0.5 select-none animate-pulse">
                Arusha
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">
              {activeRole === 'customer' ? 'Digital Dining Experience' : 'Management Terminal'}
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Logged in as: <strong className="text-amber-500 uppercase tracking-widest">{userName}</strong></span>
            <button onClick={handleLogout} className="p-2 bg-slate-950 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg text-slate-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentLang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setCurrentLang('sw')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentLang === 'sw' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              SW
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full pb-24">
        <div className="w-full">
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl min-h-[500px] flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex-grow">
              <Routes>
                {activeRole === 'customer' && (
                  <Route path="/customer" element={
                    <CustomerPortal 
                      currentLang={currentLang}
                      menu={menu.filter(item => item.isAvailable)}
                      tables={tables}
                      activeOrder={currentCustomerOrder}
                      onPlaceOrder={handlePlaceOrder}
                    />
                  } />
                )}

                {activeRole === 'kitchen' && (
                  <Route path="/kitchen" element={
                    <KitchenPortal
                      currentLang={currentLang}
                      orders={orders}
                      menu={menu}
                      onBumpCooking={handleBumpCooking}
                      onBumpReady={handleBumpReady}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  } />
                )}

                {activeRole === 'manager' && (
                  <Route path="/admin" element={
                    <AdminPortal
                      currentLang={currentLang}
                      menu={menu}
                      orders={orders}
                      onAddMenuItem={handleAddMenuItem}
                      onUpdateMenuItem={handleUpdateMenuItem}
                      onDeleteMenuItem={handleDeleteMenuItem}
                      onToggleAvailability={handleToggleAvailability}
                      onMarkServed={handleMarkServed}
                      onMarkPaid={handleMarkPaid}
                    />
                  } />
                )}

                {/* Redirect any other authenticated access to the appropriate portal or login */}
                <Route path="*" element={
                  <Navigate to={
                    activeRole === 'customer' ? '/customer' : 
                    activeRole === 'kitchen' ? '/kitchen' : 
                    activeRole === 'manager' ? '/admin' : '/'
                  } replace />
                } />
              </Routes>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
