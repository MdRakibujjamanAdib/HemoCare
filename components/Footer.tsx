import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart className="text-red-500 fill-red-500" size={24} />
              <span className="font-bold text-xl text-white">
                HemoCare Hub BD
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting lives through the power of donation. Our mission is to ensure safe blood access for everyone in Bangladesh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-red-400 transition-colors">About Us</Link></li>
              <li><Link to="/donors" className="hover:text-red-400 transition-colors">Find a Donor</Link></li>
              <li><Link to="/doctors" className="hover:text-red-400 transition-colors">Doctor Directory</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-red-500 mt-0.5" />
                <span>123 Health Avenue, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-500" />
                <span>+880 1410-805031</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-500" />
                <span>hemocarehubbd@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61586815222134" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/hemocarehubbd" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com/hemocarehubbd" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} HemoCare Hub BD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
