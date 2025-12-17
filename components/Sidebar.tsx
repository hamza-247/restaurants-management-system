
import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const menuItems = [
    { id: 'FLOOR', icon: 'fa-table-cells-large', label: 'Floor Plan', roles: ['ADMIN', 'MANAGER', 'SERVER'] },
    { id: 'ORDERS', icon: 'fa-list-check', label: 'Order List', roles: ['ADMIN', 'MANAGER', 'SERVER', 'KITCHEN'] },
    { id: 'KITCHEN', icon: 'fa-fire-burner', label: 'KDS', roles: ['ADMIN', 'MANAGER', 'KITCHEN'] },
    { id: 'INVENTORY', icon: 'fa-boxes-stacked', label: 'Inventory', roles: ['ADMIN', 'MANAGER'] },
    { id: 'ADMIN', icon: 'fa-chart-line', label: 'Dashboard', roles: ['ADMIN', 'MANAGER'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-20 lg:w-64 bg-slate-900 text-slate-400 flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-0 lg:mr-3">
          <i className="fas fa-utensils text-white"></i>
        </div>
        <span className="hidden lg:block text-white font-bold text-xl tracking-tight">Lumina<span className="text-indigo-500">RMS</span></span>
      </div>

      <nav className="flex-1 py-6 flex flex-col items-center lg:items-stretch space-y-1">
        <button 
          onClick={() => setActiveTab('POS')}
          className="mx-4 mb-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 lg:px-4 lg:py-3 rounded-xl flex items-center justify-center lg:justify-start shadow-lg shadow-indigo-900/20 transition-all"
        >
          <i className="fas fa-plus lg:mr-3"></i>
          <span className="hidden lg:block font-bold text-sm">New Order</span>
        </button>

        {deferredPrompt && (
          <button 
            onClick={handleInstall}
            className="mx-4 mb-6 bg-slate-800 hover:bg-slate-700 text-emerald-400 p-3 lg:px-4 lg:py-2 rounded-xl flex items-center justify-center lg:justify-start border border-emerald-500/20 transition-all"
          >
            <i className="fas fa-download lg:mr-3"></i>
            <span className="hidden lg:block font-bold text-xs">Install Desktop App</span>
          </button>
        )}

        {filteredMenu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-4 py-3 mx-2 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-slate-800 text-white' 
                : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${activeTab === item.id ? 'bg-indigo-600/20 text-indigo-400' : ''}`}>
              <i className={`fas ${item.icon} text-lg`}></i>
            </div>
            <span className="hidden lg:block ml-3 font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center justify-center lg:justify-start px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <i className="fas fa-right-from-bracket lg:mr-3"></i>
          <span className="hidden lg:block text-sm font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
