
import React from 'react';
import { Order } from '../types';

interface OrderPanelProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
       <div className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-800">Order History</h2>
          <p className="text-slate-500 text-sm">Tracking all active and completed transactions</p>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Order ID</th>
                  <th className="px-8 py-4">Type</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Time</th>
                  <th className="px-8 py-4">Items</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-black text-slate-800 text-sm">#{order.id.toUpperCase().slice(0, 8)}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center">
                          <i className={`fas ${order.type === 'DINE_IN' ? 'fa-chair' : 'fa-box'} mr-2 text-slate-400`}></i>
                          <span className="font-bold text-slate-600 text-xs uppercase tracking-tight">{order.type}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-black text-indigo-600">${order.total.toFixed(2)}</td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         order.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 
                         order.status === 'OPEN' ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-slate-400 text-xs font-medium">
                       {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-8 py-6 text-slate-500 text-xs font-bold">
                       {order.items.length} items
                    </td>
                  </tr>
               ))}
               {orders.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-bold italic">No orders found</td>
                 </tr>
               )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export default OrderPanel;
