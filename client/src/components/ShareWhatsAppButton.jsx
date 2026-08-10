import React from 'react';
import { MessageCircle, Share2 } from 'lucide-react';

export const ShareWhatsAppButton = ({ type = 'product', item }) => {
  const handleShare = () => {
    let message = '';
    
    if (type === 'product' && item) {
      message = `Hi! Check out this product at Uday Electrical Works (Chhota Govindpur, Jamshedpur):\n\n⚡ *${item.name}*\n🏷️ Brand: ${item.brand || 'Havells'}\n💰 Price: ₹${item.price} (MRP: ₹${item.mrp || item.price})\n📦 SKU: ${item.sku}\n\nCall Store: 7903789402 / 9934187847`;
    } else if (type === 'invoice' && item) {
      message = `*Uday Electrical Works - Tax Invoice*\n\n📄 Invoice #: ${item.invoiceNumber}\n👤 Customer: ${item.customerName || 'Resident'}\n💵 Total Amount: ₹${item.totalAmount}\n📅 Date: ${new Date(item.createdAt || Date.now()).toLocaleDateString()}\n\nThank you for choosing Uday Electricals! Call: 7903789402`;
    } else if (type === 'booking' && item) {
      message = `*Uday Electrical Works - Service Dispatch*\n\n🛠️ Booking Ref: ${item.bookingNumber}\n👨‍🔧 Electrician Assigned: ${item.assignedTechnician?.name || 'Prabhat (7470508176)'}\n📍 Address: ${item.address}\n📅 Preferred Slot: ${item.preferredTime || '10:00 AM'}\n\nEmergency Hotline: 7903789402`;
    } else {
      message = `Hi Uday Electrical Works, I am looking for electrical products / home service in Jamshedpur.`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
      title="Share to WhatsApp"
    >
      <MessageCircle className="w-3.5 h-3.5 fill-current" />
      <span>Share WhatsApp</span>
    </button>
  );
};
