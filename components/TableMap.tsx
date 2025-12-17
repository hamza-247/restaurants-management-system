
import React, { useState } from 'react';
import { Table } from '../types';

interface TableMapProps {
  tables: Table[];
  onTableClick: (id: string) => void;
  onUpdateTable: (id: string, status: Table['status']) => void;
  onAddTable?: () => void;
  onRemoveTable?: (id: string) => void;
}

const TableMap: React.FC<TableMapProps> = ({ tables, onTableClick, onUpdateTable, onAddTable, onRemoveTable }) => {
  const [designMode, setDesignMode] = useState(false);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:shadow-md hover:scale-[1.02]';
      case 'OCCUPIED': return 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02]';
      case 'DIRTY': return 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200';
      case 'RESERVED': return 'bg-slate-800 border-slate-900 text-slate-400';
      default: return 'bg-white border-slate-200 text-slate-600';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 px-2">
         <div className="flex items-center space-x-4">
           <h2 className="text-xl font-black text-slate-800 tracking-tight">Floor Management</h2>
           <span className="px-4 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-full tracking-widest">{tables.length} Active Tables</span>
         </div>
         <div className="flex items-center space-x-3">
           {designMode && onAddTable && (
             <button 
               onClick={onAddTable}
               className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all active:scale-95"
             >
               <i className="fas fa-plus"></i>
               <span>Add Table</span>
             </button>
           )}
           <button 
             onClick={() => setDesignMode(!designMode)}
             className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 shadow-sm ${designMode ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'}`}
           >
             <i className={`fas ${designMode ? 'fa-check-circle' : 'fa-layer-group'}`}></i>
             <span>{designMode ? 'Finish Layout' : 'Rearrange Grid'}</span>
           </button>
         </div>
      </div>

      <div className="relative flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-inner overflow-auto table-grid custom-scrollbar bg-slate-50/30">
        <div className="absolute inset-0 p-12 min-w-[1400px] min-h-[1100px]">
          {/* Floor markers for rows/columns */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            {/* You could add grid labels here if needed */}
          </div>

          {tables.sort((a, b) => a.number - b.number).map((table) => (
            <div
              key={table.id}
              onClick={() => !designMode && onTableClick(table.id)}
              className={`absolute flex flex-col items-center justify-center transition-all duration-300 border-2 rounded-[1.5rem] ${designMode ? 'cursor-move border-dashed border-indigo-300 bg-indigo-50/50 scale-95 opacity-80' : `cursor-pointer ${getStatusColor(table.status)}`}`}
              style={{
                left: `${table.x}px`,
                top: `${table.y}px`,
                width: `140px`, // Unified width for better grid alignment
                height: `140px`, // Unified height
              }}
            >
              <div className="relative">
                <span className="text-3xl font-black mb-1">{table.number}</span>
                {table.status === 'OCCUPIED' && (
                   <span className="absolute -top-1 -right-4 flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                   </span>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">{table.status}</span>
              
              <div className="mt-3 flex space-x-1">
                {Array.from({ length: Math.min(table.capacity, 6) }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-25"></div>
                ))}
                {table.capacity > 6 && <span className="text-[8px] font-bold">+</span>}
              </div>

              {!designMode && table.status === 'DIRTY' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTable(table.id, 'AVAILABLE');
                  }}
                  className="absolute -bottom-3 bg-white px-3 py-1.5 rounded-full text-[9px] font-black shadow-lg hover:bg-slate-50 border border-amber-200 text-amber-600 uppercase tracking-widest z-10"
                >
                  Clear Table
                </button>
              )}

              {designMode && onRemoveTable && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTable(table.id);
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-xl hover:bg-rose-600 hover:scale-110 transition-transform active:scale-90"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Floating Legend */}
        <div className="sticky bottom-8 left-1/2 -translate-x-1/2 inline-flex bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-4 space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-300 shadow-2xl z-20">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-white border border-slate-400 mr-3"></div> Available</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-500 mr-3 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div> Occupied</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-400 mr-3"></div> Dirty</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-600 mr-3"></div> Reserved</div>
        </div>
      </div>
    </div>
  );
};

export default TableMap;
