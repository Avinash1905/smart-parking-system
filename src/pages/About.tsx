import React from 'react';
import { ShieldCheck, Cpu, Cloud, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#080F1C]">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-[#1F2937] text-[#38BDF8] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>About SmartPark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Revolutionizing Urban Parking Through IoT Intelligence
        </h1>
        <p className="text-[#94A3B8] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          SmartPark transforms congested cities into frictionless ecosystems by connecting real-time IoT sensors, automated plate scanners, and smart wallets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 bg-[#111827] border-[#1F2937]">
          <div className="w-12 h-12 rounded-xl bg-[#1E40AF]/30 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">AI Computer Vision</h3>
          <p className="text-sm text-[#94A3B8]">
            Instant automatic number plate recognition with 99.8% precision, cutting queue times at entry gates to under 1.2 seconds.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-[#111827] border-[#1F2937]">
          <div className="w-12 h-12 rounded-xl bg-[#1E40AF]/30 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
            <Cloud className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">Cloud IoT Grid</h3>
          <p className="text-sm text-[#94A3B8]">
            Ultrasonic and magnetic spot sensors update live availability in under 500 milliseconds across thousands of parking lots.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-[#111827] border-[#1F2937]">
          <div className="w-12 h-12 rounded-xl bg-[#1E40AF]/30 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">Secure Digital Ledger</h3>
          <p className="text-sm text-[#94A3B8]">
            End-to-end encrypted micro-transactions, contactless pass management, and automated fleet billing.
          </p>
        </Card>
      </div>
    </div>
  );
};
