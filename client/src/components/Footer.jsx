import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-card border-t border-brand-border/80 pt-16 pb-8 text-brand-ivory/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-goldHover flex items-center justify-center shadow-gold">
                <UtensilsCrossed className="w-5 h-5 text-brand-dark" />
              </div>
              <span className="font-serif text-2xl font-bold gold-gradient-text">Draksha</span>
            </Link>
            <p className="text-xs text-brand-muted leading-relaxed">
              Crafted fresh with love. Experience the finest Belgian waffles, artisanal scoops, fudgy brownies, creamy shakes, and crispy savouries in a warm, luxurious atmosphere.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-brand-ivory mb-4 border-b border-brand-gold/30 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-brand-gold transition-colors">Full Restaurant Menu</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors">Our Story & Craft</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Us & Location</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-brand-gold/70 hover:text-brand-gold transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Menu Categories */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-brand-ivory mb-4 border-b border-brand-gold/30 pb-2 inline-block">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/menu/waffles" className="hover:text-brand-gold transition-colors">Belgian Waffles</Link>
              </li>
              <li>
                <Link to="/menu/brownies" className="hover:text-brand-gold transition-colors">Brownies & Lava Cakes</Link>
              </li>
              <li>
                <Link to="/menu/milk-shakes" className="hover:text-brand-gold transition-colors">Thick Milkshakes</Link>
              </li>
              <li>
                <Link to="/menu/scoops" className="hover:text-brand-gold transition-colors">Ice Cream Scoops</Link>
              </li>
              <li>
                <Link to="/menu/non-veg" className="hover:text-brand-gold transition-colors">Non-Veg Snacks & Rolls</Link>
              </li>
              <li>
                <Link to="/menu/veg" className="hover:text-brand-gold transition-colors">Crispy Veg & Fries</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-brand-ivory mb-4 border-b border-brand-gold/30 pb-2 inline-block">
              Contact & Hours
            </h4>
            <ul className="space-y-3 text-xs">
              <a href="https://maps.app.goo.gl/LcsrsNJuQUh5AEx6A?g_st=aw" target='_main'><li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Nadhi Agraharam, road Old Houseing board colony, Near K.P.N. Hospital ,
Jogulamba Gadwal. District Telangana. state. 509125.</span>
              </li>
              </a>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 6281821967</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>bhuvaneshwarimr18@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-brand-goldLight">
                <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Open Everyday: 11:00 AM - 9:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted">
          <p>© 2026 Draksha Dessert & Café. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for food lovers.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
