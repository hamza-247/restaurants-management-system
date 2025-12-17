
import React from 'react';
import { Order } from '../types';

interface KDSProps {
  orders: Order[];
  onCompleteItem: (orderId: string, itemId: string) => void;
}

const KDS: React.FC<KDSProps> = ({ orders, onCompleteItem }) => {
  const getElapsedMinutes = (createdAt: string) => {
    const start = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return Math.floor((now - start) / 60000);
  };

  return (
    <div className="flex flex-wrap gap-6 items-start">
      {orders.length === 0 ? (
        <div className="w-full h-96 flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
           <i className="fas fa-receipt text-7xl"></i>
           <p className="text-xl font-bold">No active orders</p>
        </div>
      ) : orders.map(order => (
        <div key={order.id} className="w-80 bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
          <div className={`p-4 ${getElapsedMinutes(order.createdAt) > 15 ? 'bg-red-500' : 'bg-slate-800'} text-white flex justify-between items-center`}>
            <div>
              <h3 className="font-black text-lg">#{order.id.slice(-4)}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                {order.tableId ? `Table ${order.tableId}` : order.type}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black">{getElapsedMinutes(order.createdAt)}m</span>
              <p className="text-[10px] font-bold opacity-70">WAIT TIME</p>
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <ul className="space-y-3">
              {order.items.map(item => (
                <li key={item.id} className={`flex items-start justify-between p-3 rounded-2xl border transition-all ${item.status === 'READY' ? 'bg-green-50 border-green-200 opacity-50' : 'bg-slate-50 border-slate-100 hover:border-indigo-300'}`}>
                   <div className="flex-1">
                     <div className="flex items-center">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black mr-3">{item.quantity}</span>
                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                     </div>
                     {item.modifiers.length > 0 && (
                       <p className="mt-1 ml-9 text-[10px] text-red-500 font-bold uppercase tracking-tight">{item.modifiers.join(', ')}</p>
                     )}
                   </div>
                   {item.status !== 'READY' && (
                     <button 
                       onClick={() => onCompleteItem(order.id, item.id)}
                       className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                     >
                       <i className="fas fa-check text-xs"></i>
                     </button>
                   )}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex space-x-2">
             <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">BUMP ORDER</button>
             <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">PRINT TICKET</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KDS;
