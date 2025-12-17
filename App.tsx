
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_USERS, INITIAL_TABLES, INITIAL_MENU, INITIAL_INVENTORY } from './constants';
import { Table, MenuItem, Order, User, InventoryItem, Role, OrderItem, OrderType } from './types';
import TableMap from './components/TableMap';
import OrderPanel from './components/OrderPanel';
import KDS from './components/KDS';
import InventoryManagement from './components/InventoryManagement';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import POS from './components/POS';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'ORDERS' | 'KITCHEN' | 'INVENTORY' | 'ADMIN' | 'POS'>('FLOOR');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Computed Values
  const openOrders = useMemo(() => orders.filter(o => o.status === 'OPEN'), [orders]);
  const activeTable = useMemo(() => tables.find(t => t.id === selectedTableId), [tables, selectedTableId]);

  // Actions
  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId);
    setActiveTab('POS');
  };

  const addTable = () => {
    const nextNum = Math.max(...tables.map(t => t.number), 0) + 1;
    const newTable: Table = {
      id: `t${Date.now()}`,
      number: nextNum,
      capacity: 4,
      status: 'AVAILABLE',
      x: ((nextNum - 1) % 5) * 220 + 60,
      y: Math.floor((nextNum - 1) / 5) * 220 + 60,
    };
    setTables(prev => [...prev, newTable]);
  };

  const removeTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `m${Date.now()}`,
    };
    setMenu(prev => [...prev, newItem]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenu(prev => prev.map(m => m.id === item.id ? item : m));
  };

  const removeMenuItem = (id: string) => {
    setMenu(prev => prev.filter(m => m.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `i${Date.now()}`,
    };
    setInventory(prev => [...prev, newItem]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
    if (order.tableId) {
      setTables(prev => prev.map(t => 
        t.id === order.tableId ? { ...t, status: 'OCCUPIED', currentOrderId: order.id } : t
      ));
    }
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    if (updatedOrder.status === 'PAID' && updatedOrder.tableId) {
      setTables(prev => prev.map(t => 
        t.id === updatedOrder.tableId ? { ...t, status: 'DIRTY', currentOrderId: undefined } : t
      ));
    }
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const handleKDSComplete = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        items: o.items.map(item => item.id === itemId ? { ...item, status: 'READY' } : item)
      };
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'FLOOR':
        return (
          <TableMap 
            tables={tables} 
            onTableClick={handleTableClick} 
            onUpdateTable={updateTableStatus} 
            onAddTable={addTable}
            onRemoveTable={removeTable}
          />
        );
      case 'POS':
        return (
          <POS 
            menu={menu} 
            activeTable={activeTable} 
            orders={orders}
            onSaveOrder={addOrder} 
            onUpdateOrder={updateOrder}
            onBack={() => setActiveTab('FLOOR')}
          />
        );
      case 'KITCHEN':
        return <KDS orders={openOrders} onCompleteItem={handleKDSComplete} />;
      case 'INVENTORY':
        return (
          <InventoryManagement 
            inventory={inventory} 
            setInventory={setInventory} 
            onAddItem={addInventoryItem}
          />
        );
      case 'ADMIN':
        return (
          <AdminDashboard 
            orders={orders} 
            inventory={inventory} 
            menu={menu} 
            onAddMenuItem={addMenuItem}
            onUpdateMenuItem={updateMenuItem}
            onRemoveMenuItem={removeMenuItem}
          />
        );
      case 'ORDERS':
        return <OrderPanel orders={orders} onSelectOrder={(o) => { /* logic to view order */ }} />;
      default:
        return <TableMap tables={tables} onTableClick={handleTableClick} onUpdateTable={updateTableStatus} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        currentUser={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {}} 
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center space-x-4">
             <h1 className="text-xl font-bold text-slate-800">
               {activeTab === 'POS' && activeTable ? `Table ${activeTable.number}` : activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
             </h1>
             {activeTab === 'POS' && !activeTable && <span className="text-slate-500 font-medium">Quick Order / Delivery</span>}
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Live System Sync</span>
            </div>
            <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
               <div className="text-right">
                 <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                 <p className="text-[10px] text-slate-500 uppercase tracking-wider">{currentUser.role}</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                 {currentUser.name.split(' ').map(n => n[0]).join('')}
               </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-slate-100 p-4 lg:p-6 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
