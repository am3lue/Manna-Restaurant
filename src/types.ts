export type UserRole = 'customer' | 'kitchen' | 'manager';

export interface LanguageStrings {
  // Navigation & General
  welcome: string;
  tagline: string;
  roleSelect: string;
  customerRole: string;
  waiterRole: string;
  kitchenRole: string;
  managerRole: string;
  architectureBlueprint: string;
  switchRoleMsg: string;
  backToTop: string;
  swahili: string;
  english: string;

  // Currency
  tzs: string;

  // Customer Portal
  customerPortalTitle: string;
  qrOrdering: string;
  tableNumber: string;
  selectYourTable: string;
  enterName: string;
  searchFoodPlaceholder: string;
  allCategories: string;
  addToCart: string;
  addedToCart: string;
  cart: string;
  cartEmpty: string;
  specialInstructions: string;
  specialInstructionsDesc: string;
  paymentMethod: string;
  placeOrder: string;
  orderPlacing: string;
  activeOrderHeading: string;
  trackOrderStatus: string;
  orderReceived: string;
  orderCooking: string;
  orderReady: string;
  orderServed: string;
  orderPaid: string;
  paymentMethodPlaceholder: string;
  cashOnPayment: string;
  tanzaniaMobilePay: string;
  paySuccessMessage: string;

  // Waiter Portal
  waiterPortalTitle: string;
  tablesGrid: string;
  activeOrders: string;
  newManualOrder: string;
  assignTable: string;
  createOrder: string;
  sentToKitchen: string;
  markAsServed: string;
  receivedFoodAlert: string;

  // Kitchen Display (KDS)
  kitchenPortalTitle: string;
  activeTickets: string;
  noOrders: string;
  itemNotes: string;
  bumpCooking: string;
  bumpReady: string;
  completedOrders: string;
  priorityHigh: string;
  priorityNormal: string;

  // Manager/Admin Portal
  managerPortalTitle: string;
  totalSales: string;
  pendingOrders: string;
  avgPreparationTime: string;
  menuManagement: string;
  addMenuItem: string;
  editItem: string;
  saveItem: string;
  deleteItem: string;
  reportsAnalytics: string;
  swahiliName: string;
  englishName: string;
  category: string;
  price: string;
}

export type Language = 'en' | 'sw';

export interface MenuItem {
  id: string;
  nameEn: string;
  nameSw: string;
  descEn: string;
  descSw: string;
  price: number;
  category: 'food' | 'drink' | 'sides' | 'specials';
  image: string;
  isAvailable: boolean;
  stockCount?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Table {
  id: number;
  number: string;
  status: 'empty' | 'occupied' | 'waiting' | 'ready_to_serve';
  assignedWaiterId?: string;
  currentOrderId?: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'paid';

export interface Order {
  id: string;
  customerName: string;
  tableId: string;
  items: {
    menuItemId: string;
    nameEn: string;
    nameSw: string;
    price: number;
    quantity: number;
  }[];
  notes?: string;
  status: OrderStatus;
  paymentMethod: 'M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Cash' | 'none';
  paymentStatus: 'unpaid' | 'paid';
  totalAmount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  version?: number;
}

export interface LiveLog {
  id: string;
  timestamp: string;
  role: UserRole | 'system';
  messageEn: string;
  messageSw: string;
}
