
import { Table, MenuItem, User, InventoryItem } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alex Admin', role: 'ADMIN' },
  { id: 'u2', name: 'Maria Manager', role: 'MANAGER' },
  { id: 'u3', name: 'Sam Server', role: 'SERVER' },
  { id: 'u4', name: 'Ken Kitchen', role: 'KITCHEN' },
];

// Initialize 20 tables in a clean 5-column by 4-row grid
export const INITIAL_TABLES: Table[] = Array.from({ length: 20 }, (_, i) => {
  const colCount = 5;
  const col = i % colCount;
  const row = Math.floor(i / colCount);
  const spacingX = 220;
  const spacingY = 220;
  const padding = 60;

  return {
    id: `t${i + 1}`,
    number: i + 1,
    capacity: (i % 5 === 0 || i % 5 === 4) ? 6 : 4, // Vary capacity for visual interest but keep grid
    status: 'AVAILABLE',
    x: col * spacingX + padding,
    y: row * spacingY + padding,
  };
});

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', name: 'Wagyu Burger', price: 18.50, category: 'Main', description: 'Premium wagyu beef with secret sauce', image: 'https://picsum.photos/seed/burger/400/300', inStock: 50 },
  { id: 'm2', name: 'Truffle Fries', price: 8.00, category: 'Sides', description: 'Crispy fries with parmesan and truffle oil', image: 'https://picsum.photos/seed/fries/400/300', inStock: 100 },
  { id: 'm3', name: 'Caesar Salad', price: 12.00, category: 'Main', description: 'Fresh romaine with house-made dressing', image: 'https://picsum.photos/seed/salad/400/300', inStock: 30 },
  { id: 'm4', name: 'Craft Beer', price: 7.50, category: 'Drinks', description: 'Local IPA brewery selection', image: 'https://picsum.photos/seed/beer/400/300', inStock: 200 },
  { id: 'm5', name: 'Margarita Pizza', price: 15.00, category: 'Main', description: 'Classic buffalo mozzarella and basil', image: 'https://picsum.photos/seed/pizza/400/300', inStock: 40 },
  { id: 'm6', name: 'Chocolate Lava Cake', price: 9.00, category: 'Dessert', description: 'Warm molten center with vanilla ice cream', image: 'https://picsum.photos/seed/cake/400/300', inStock: 15 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Wagyu Beef', currentStock: 20, unit: 'kg', minThreshold: 5 },
  { id: 'i2', name: 'Potatoes', currentStock: 50, unit: 'kg', minThreshold: 10 },
  { id: 'i3', name: 'Romaine Lettuce', currentStock: 10, unit: 'heads', minThreshold: 15 },
  { id: 'i4', name: 'Mozzarella', currentStock: 8, unit: 'kg', minThreshold: 3 },
  { id: 'i5', name: 'Craft IPA Kegs', currentStock: 5, unit: 'kegs', minThreshold: 2 },
];
