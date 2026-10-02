import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: 'Draksha Dessert & Café' },
    logo: { type: String, default: '' },
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'contact@draksha.com' },
    address: { type: String, default: '123 Gourmet Boulevard, Foodville, India' },
    openingHours: { type: String, default: '11:00 AM - 11:00 PM (Everyday)' },
    taxRate: { type: Number, default: 5 }, // 5% GST
    deliveryFee: { type: Number, default: 40 }, // ₹40
    currency: { type: String, default: '₹' },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
