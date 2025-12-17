
import React, { useState, useMemo } from 'react';
import { MenuItem, Table, Order, OrderItem, OrderType } from '../types';

interface POSProps {
  menu: MenuItem[];
  activeTable?: Table;
  orders: Order[];
  onSaveOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onBack: () => void;
}

const POS: React.FC<POSProps> = ({ menu, activeTable, orders, onSaveOrder, onUpdateOrder, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>(activeTable ? 'DINE_IN' : 'TAKEOUT');
  const [paymentStep, setPaymentStep] = useState(false);
  
  const existingOrder = useMemo(() => orders.find(o => o.tableId === activeTable?.id && o.status === 'OPEN'), [orders, activeTable]);
  
  // Local state for active session
  React.useEffect(() => {
    if (existingOrder) {
      setCurrentOrderItems(existingOrder.items);
    }
  }, [existingOrder]);

  const categories = ['All', ...Array.from(new Set(menu.map(m => m.category)))];
  const filteredMenu = selectedCategory === 'All' ? menu : menu.filter(m => m.category === selectedCategory);

  const subtotal = currentOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const addItem = (item: MenuItem) => {
    setCurrentOrderItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers: [],
        status: 'PENDING'
      }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCurrentOrderItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleSendToKitchen = () => {
    if (existingOrder) {
      onUpdateOrder({ ...existingOrder, items: currentOrderItems, subtotal, tax, total });
    } else {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        tableId: activeTable?.id,
        type: orderType,
        items: currentOrderItems,
        subtotal, tax, tip: 0, discount: 0, total,
        status: 'OPEN',
        createdAt: new Date().toISOString()
      };
      onSaveOrder(newOrder);
    }
    onBack();
  };

  const handleFinalPayment = () => {
    if (existingOrder) {
      onUpdateOrder({ ...existingOrder, status: 'PAID', items: currentOrderItems, subtotal, tax, total });
    }
    onBack();
  };

  if (paymentStep) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center">
          <button onClick={() => setPaymentStep(false)} className="mr-4 hover:text-indigo-600"><i className="fas fa-arrow-left text-xl"></i></button>
          Checkout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 font-medium"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-500 font-medium"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-2xl font-black text-slate-800 pt-4 border-t border-slate-100"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Payment</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="h-24 bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"><i className="fas fa-credit-card text-xl mb-2"></i> Card</button>
                <button className="h-24 bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"><i className="fas fa-money-bill-wave text-xl mb-2"></i> Cash</button>
                <button className="h-24 bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"><i className="fab fa-apple-pay text-2xl mb-2"></i> Apple Pay</button>
                <button className="h-24 bg-white border-2 border-slate-200 rounded-xl flex flex-col items-center justify-center font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all"><i className="fas fa-wallet text-xl mb-2"></i> Other</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="bg-slate-900 rounded-2xl p-6 text-white h-full flex flex-col">
              <div className="mb-8"><i className="fas fa-print text-4xl text-indigo-400"></i></div>
              <h3 className="text-xl font-bold mb-2">Thermal Receipt Sync</h3>
              <p className="text-slate-400 text-sm mb-8">System is connected to "Counter Printer 01". Receipt will auto-print on payment completion.</p>
              <div className="mt-auto">
                 <button onClick={handleFinalPayment} className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-indigo-900/50">COMPLETE PAYMENT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex overflow-x-auto gap-2 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
          {filteredMenu.map(item => (
            <button 
              key={item.id}
              onClick={() => addItem(item)}
              className="flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-400 hover:shadow-lg transition-all text-left"
            >
              <div className="h-32 w-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg text-xs font-black shadow-sm">${item.price.toFixed(2)}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 mb-1 leading-tight">{item.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight line-clamp-2">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-xl text-slate-800">Order Detail</h2>
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          {currentOrderItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
              <i className="fas fa-shopping-basket text-6xl"></i>
              <p className="font-bold">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-indigo-600 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm hover:text-indigo-600"><i className="fas fa-minus text-xs"></i></button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm hover:text-indigo-600"><i className="fas fa-plus text-xs"></i></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="space-y-2 mb-6 text-sm">
             <div className="flex justify-between text-slate-500 font-medium"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between text-slate-500 font-medium"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
             <div className="flex justify-between text-lg font-black text-slate-800 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="flex flex-col space-y-3">
             <button 
               onClick={handleSendToKitchen}
               disabled={currentOrderItems.length === 0}
               className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
             >
               SEND TO KITCHEN
             </button>
             <button 
               onClick={() => setPaymentStep(true)}
               disabled={currentOrderItems.length === 0}
               className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100"
             >
               PAYMENT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
