import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0F172A] border-t border-[#1F2937] transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                🅿
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                SMART<span className="text-[#38BDF8]">PARK</span>
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              AI-driven urban parking platform connecting smart drivers with real-time spaces across cities.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#38BDF8] bg-[#080F1C] border border-[#1F2937] px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Smart IoT Grid &bull; 99.9% Uptime</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/find-parking" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
                  Find Live Parking
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
                  About SmartPark
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
                  Member Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>Automated License Plate Recognition</li>
              <li>EV Charging Station Integration</li>
              <li>Enterprise Fleet Management</li>
              <li>Municipal Smart City Hub</li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>100 Innovation Way, Suite 400</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>+1 (800) 555-PARK</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>support@smartpark.io</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>&copy; {new Date().getFullYear()} SmartPark Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for next-gen mobility</span>
            <Heart className="w-3.5 h-3.5 text-[#38BDF8] fill-[#38BDF8]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
