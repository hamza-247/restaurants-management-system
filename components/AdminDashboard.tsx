
import React, { useState, useEffect } from 'react';
import { Order, InventoryItem, MenuItem } from '../types';
import { getManagerInsights, suggestMenuImprovements } from '../services/geminiService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AdminDashboardProps {
  orders: Order[];
  inventory: InventoryItem[];
  menu: MenuItem[];
  onAddMenuItem?: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem?: (item: MenuItem) => void;
  onRemoveMenuItem?: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, inventory, menu, onAddMenuItem, onUpdateMenuItem, onRemoveMenuItem }) => {
  const [insights, setInsights] = useState<string>('Generating AI Insights...');
  const [menuInsights, setMenuInsights] = useState<string>('Analyzing menu...');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const initialNewItem = { name: '', price: 0, category: 'Main', description: '', image: '', inStock: 0 };
  const [formData, setFormData] = useState(initialNewItem);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        getManagerInsights(orders, inventory),
        suggestMenuImprovements(menu)
      ]);
      setInsights(res1 || "No insights available.");
      setMenuInsights(res2 || "Menu analysis failed.");
      setLoading(false);
    };
    fetchInsights();
  }, [orders, inventory, menu]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (onUpdateMenuItem) {
        onUpdateMenuItem({ ...formData, id: editingItem.id });
      }
    } else {
      if (onAddMenuItem) {
        onAddMenuItem(formData);
      }
    }
    closeForm();
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData(initialNewItem);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'PAID' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const chartData = [
    { name: 'Mon', revenue: 2400 },
    { name: 'Tue', revenue: 1398 },
    { name: 'Wed', revenue: 9800 },
    { name: 'Thu', revenue: 3908 },
    { name: 'Fri', revenue: 4800 },
    { name: 'Sat', revenue: 3800 },
    { name: 'Sun', revenue: 4300 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Menu Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Menu & Item Management</h2>
            <p className="text-slate-500 text-sm">Add, edit, or remove items across all terminals</p>
          </div>
          <button 
            onClick={() => showAddForm ? closeForm() : setShowAddForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center space-x-2"
          >
            <i className={`fas ${showAddForm ? 'fa-times' : 'fa-plus'}`}></i>
            <span>{showAddForm ? 'Cancel' : 'Add Item'}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleFormSubmit} className="p-8 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
            <h3 className="text-lg font-bold text-slate-700 mb-6">{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Name</label>
                <input type="text" placeholder="Item Name" className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price ($)</label>
                <input type="number" step="0.01" placeholder="Price" className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                <select className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Main">Main</option>
                  <option value="Sides">Sides</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Image URL</label>
                <input type="text" placeholder="Image URL" className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Initial Stock</label>
                <input type="number" placeholder="Initial Stock" className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.inStock || ''} onChange={e => setFormData({...formData, inStock: parseInt(e.target.value)})} required />
              </div>
              <div className="flex flex-col space-y-2 md:col-span-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                <textarea placeholder="Description" className="p-3 border rounded-xl outline-indigo-500 bg-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="md:col-span-3 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">
                {editingItem ? 'UPDATE PRODUCT' : 'SAVE ITEM TO MENU'}
              </button>
            </div>
          </form>
        )}

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.map(item => (
            <div key={item.id} className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-all">
              <img src={item.image} className="w-full h-32 object-cover rounded-xl mb-3" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 truncate pr-2">{item.name}</h3>
                  <p className="text-indigo-600 font-black">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditForm(item)}
                    className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow hover:bg-indigo-50"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </button>
                  {onRemoveMenuItem && (
                    <button 
                      onClick={() => onRemoveMenuItem(item.id)}
                      className="w-8 h-8 bg-white text-rose-500 rounded-full flex items-center justify-center shadow hover:bg-rose-50"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="font-bold text-slate-500 text-sm mb-2">Revenue</p>
          <h2 className="text-3xl font-black text-slate-800">${totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="font-bold text-slate-500 text-sm mb-2">Orders</p>
          <h2 className="text-3xl font-black text-slate-800">{totalOrders}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="font-bold text-slate-500 text-sm mb-2">Avg Ticket</p>
          <h2 className="text-3xl font-black text-slate-800">${avgTicket.toFixed(2)}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="font-bold text-slate-500 text-sm mb-2">Wait Time</p>
          <h2 className="text-3xl font-black text-slate-800">14m</h2>
        </div>
      </div>

      <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center"><i className="fas fa-sparkles text-sm"></i></div>
          <h3 className="text-xl font-bold">AI Intelligence</h3>
        </div>
        {loading ? <div className="animate-pulse flex space-x-2"><div className="w-2 h-2 bg-indigo-400 rounded-full"></div><div className="w-2 h-2 bg-indigo-400 rounded-full"></div></div> : (
          <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed text-indigo-100">
            <div><p className="text-indigo-400 font-black text-[10px] uppercase mb-2">Actionable Insights</p>{insights}</div>
            <div><p className="text-indigo-400 font-black text-[10px] uppercase mb-2">Optimization</p>{menuInsights}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
