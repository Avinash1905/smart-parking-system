import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car, CreditCard, QrCode, LogOut, Navigation } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080F1C]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F172A] border border-[#1F2937] text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E40AF]/40 border border-[#2563EB]/40 text-[#38BDF8] flex items-center justify-center font-bold text-2xl shadow-inner">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Driver Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#2563EB] text-white">
                User Role
              </span>
            </div>
            <p className="text-[#94A3B8] text-sm mt-0.5">
              Welcome back, <span className="text-white font-semibold">{user?.name || user?.username}</span> &bull; {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="danger" size="md" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Parking Session Card */}
        <Card glow className="lg:col-span-2 p-6 space-y-6 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-ping" />
              <span>ACTIVE PARKING SESSION</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30">
              Bay #B-14 &bull; EV Fast Charger
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#080F1C] border border-[#1F2937]">
            <div>
              <p className="text-xs text-[#94A3B8]">Location</p>
              <p className="font-bold text-white text-sm mt-0.5">Grand Central Smart Hub</p>
              <p className="text-xs text-[#94A3B8]">Floor 2 &bull; Zone Blue</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Elapsed Time</p>
              <p className="font-bold text-[#38BDF8] text-base mt-0.5">1 hr 24 mins</p>
              <p className="text-xs text-[#94A3B8]">Started 10:45 AM</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Current Cost</p>
              <p className="font-bold text-white text-base mt-0.5">$9.10</p>
              <p className="text-xs text-[#38BDF8]">Autopay enabled</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <QrCode className="w-4 h-4 text-[#38BDF8]" />
              <span>License Plate: <strong className="text-white">7XYZ-892 (Tesla Model 3)</strong></span>
            </div>
            <Link to="/find-parking">
              <Button size="sm" variant="outline" className="border-[#2563EB] text-[#38BDF8]">
                <Navigation className="w-4 h-4 mr-1.5" />
                <span>Find Another Lot</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Smart Wallet Card */}
        <Card className="p-6 space-y-5 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">SmartPark Wallet</h3>
            <CreditCard className="w-5 h-5 text-[#38BDF8]" />
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] text-white space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#94A3B8]">Balance</span>
            <p className="text-3xl font-extrabold text-[#38BDF8]">$64.50</p>
            <div className="flex justify-between items-center text-xs text-[#94A3B8] pt-2 border-t border-[#1F2937]">
              <span>Auto-Reload: $25.00</span>
              <span className="text-[#38BDF8] font-medium">Active</span>
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
            Top-up Wallet Balance
          </Button>
        </Card>

      </div>
    </div>
  );
};
