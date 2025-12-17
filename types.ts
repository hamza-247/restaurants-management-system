
export type Role = 'ADMIN' | 'MANAGER' | 'SERVER' | 'KITCHEN';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'DIRTY' | 'RESERVED';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  x: number;
  y: number;
  currentOrderId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  inStock: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED';
}

export type OrderType = 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';

export interface Order {
  id: string;
  tableId?: string;
  type: OrderType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  status: 'OPEN' | 'PAID' | 'CANCELLED';
  createdAt: string;
  customerName?: string;
  address?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
}
