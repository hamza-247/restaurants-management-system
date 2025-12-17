
import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface InventoryProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  onAddItem?: (item: Omit<InventoryItem, 'id'>) => void;
}

const InventoryManagement: React.FC<InventoryProps> = ({ inventory, setInventory, onAddItem }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    currentStock: 0,
    unit: 'kg',
    minThreshold: 5
  });

  const updateStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, currentStock: Math.max(0, item.currentStock + delta) } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddItem) {
      onAddItem(newItem);
      setShowAddForm(false);
      setNewItem({ name: '', currentStock: 0, unit: 'kg', minThreshold: 5 });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Inventory Management</h2>
          <p className="text-slate-500 text-sm">Track raw ingredients and stock levels</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
            showAddForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
          <span>{showAddForm ? 'Cancel' : 'Add Item'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-8 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tomato Sauce" 
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-indigo-500 font-medium"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  required 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Unit</label>
                <input 
                  type="text" 
                  placeholder="kg, liters, boxes" 
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-indigo-500 font-medium"
                  value={newItem.unit}
                  onChange={e => setNewItem({...newItem, unit: e.target.value})}
                  required 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Current Stock</label>
                <input 
                  type="number" 
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-indigo-500 font-medium"
                  value={newItem.currentStock || ''}
                  onChange={e => setNewItem({...newItem, currentStock: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Min. Threshold</label>
                <input 
                  type="number" 
                  className="p-3 bg-white border border-slate-200 rounded-xl outline-indigo-500 font-medium"
                  value={newItem.minThreshold || ''}
                  onChange={e => setNewItem({...newItem, minThreshold: parseFloat(e.target.value) || 0})}
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="md:col-span-4 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                ADD TO INVENTORY
              </button>
           </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-4">Item Name</th>
              <th className="px-8 py-4">Current Stock</th>
              <th className="px-8 py-4">Unit</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Threshold</th>
              <th className="px-8 py-4 text-center">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic font-medium">No items in inventory. Click "Add Item" to start.</td>
              </tr>
            ) : inventory.map(item => {
              const isLow = item.currentStock <= item.minThreshold;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-800">{item.name}</td>
                  <td className="px-8 py-6">
                    <span className={`text-lg font-black ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium">{item.unit}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      isLow ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {isLow ? 'Low Stock' : 'Healthy'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-400 font-bold">{item.minThreshold} {item.unit}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-2">
                       <button onClick={() => updateStock(item.id, -1)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center"><i className="fas fa-minus text-[10px] text-slate-400 group-hover:text-rose-500"></i></button>
                       <button onClick={() => updateStock(item.id, 1)} className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center"><i className="fas fa-plus text-[10px] text-slate-400 group-hover:text-emerald-500"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
