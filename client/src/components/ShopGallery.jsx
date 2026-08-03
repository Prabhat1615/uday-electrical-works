import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Users, ShoppingBag } from 'lucide-react';

export const ShopGallery = () => {
  const [activeTab, setActiveTab] = useState('shop');

  const galleryImages = {
    shop: [
      { url: 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?w=800&auto=format&fit=crop&q=60', caption: 'Uday Electrical Shop Front Counter - Chhota Govindpur' },
      { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60', caption: 'Appliance & Wiring Inventory Display' }
    ],
    team: [
      { name: 'Prabhat', role: 'Senior Electrician', phone: '7470508176', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60' },
      { name: 'Chandan', role: 'Appliance Repair Lead', phone: '7209455250', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60' },
      { name: 'Devnath', role: 'Wireman & DB Specialist', phone: '9934187847', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60' },
      { name: 'Appu', role: 'Senior Field Technician', phone: '7903789402', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60' }
    ],
    services: [
      { url: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=800&auto=format&fit=crop&q=60', caption: 'Ceiling Fan Balancing & Regulator Repair' },
      { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=60', caption: 'Water Heater Geyser Heating Element Descaling' }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shop'
              ? 'bg-orange-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Shop & Counter Photos</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'team'
              ? 'bg-orange-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Technicians Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-orange-500 text-slate-950 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Workmanship Gallery</span>
        </button>
      </div>

      {/* Gallery Displays */}
      {activeTab === 'team' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.team.map((tech, idx) => (
            <div key={idx} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-3">
              <img src={tech.img} alt={tech.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-orange-500" />
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{tech.name}</h4>
                <p className="text-[11px] text-blue-500 font-bold">{tech.role}</p>
                <a href={`tel:${tech.phone}`} className="text-[10px] text-slate-500 block mt-1 hover:text-orange-500 font-mono">
                  📞 {tech.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(galleryImages[activeTab] || []).map((img, idx) => (
            <div key={idx} className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative group">
              <img src={img.url} alt={img.caption} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-3 bg-slate-900/90 backdrop-blur-md absolute bottom-0 inset-x-0 border-t border-slate-800">
                <p className="text-xs font-bold text-white">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
