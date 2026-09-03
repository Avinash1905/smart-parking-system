import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, ParkingSquare, DollarSign, Activity, LogOut, BarChart3, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080F1C]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F172A] border border-[#1F2937] text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E40AF]/40 border border-[#2563EB]/40 text-[#38BDF8] flex items-center justify-center font-bold text-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Admin Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#2563EB] text-white">
                Admin Role
              </span>
            </div>
            <p className="text-[#94A3B8] text-sm mt-0.5">
              Logged in as <span className="text-white font-medium">{user?.name || user?.username}</span> &bull; {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="danger" size="md" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Managed Lots</span>
            <ParkingSquare className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <p className="text-3xl font-extrabold text-white">142</p>
          <p className="text-xs text-[#38BDF8] flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> All sensors online
          </p>
        </Card>

        <Card className="p-5 space-y-2 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Occupancy</span>
            <Activity className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-extrabold text-white">76.4%</p>
          <p className="text-xs text-[#94A3B8]">19,100 of 25,000 slots occupied</p>
        </Card>

        <Card className="p-5 space-y-2 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Drivers</span>
            <Users className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <p className="text-3xl font-extrabold text-white">8,492</p>
          <p className="text-xs text-[#38BDF8] font-medium">+14% vs yesterday</p>
        </Card>

        <Card className="p-5 space-y-2 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Revenue</span>
            <DollarSign className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <p className="text-3xl font-extrabold text-white">$34,820</p>
          <p className="text-xs text-[#38BDF8] font-medium">+8.2% automated toll capture</p>
        </Card>
      </div>

      {/* Facility List Preview */}
      <Card className="p-6 space-y-4 bg-[#111827] border-[#1F2937]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Live Facility Status</h2>
            <p className="text-xs text-[#94A3B8]">Real-time gate and sensor telemetry</p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<BarChart3 className="w-4 h-4" />} className="border-[#2563EB] text-[#38BDF8]">
            Export Telemetry
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-[#94A3B8] border-b border-[#1F2937]">
              <tr>
                <th className="pb-3 font-semibold">Facility Name</th>
                <th className="pb-3 font-semibold">Capacity</th>
                <th className="pb-3 font-semibold">Occupancy</th>
                <th className="pb-3 font-semibold">Gate Status</th>
                <th className="pb-3 font-semibold">System Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937] text-[#94A3B8]">
              <tr>
                <td className="py-3 font-medium text-white">Grand Central Smart Hub</td>
                <td className="py-3">120 bays</td>
                <td className="py-3 text-[#38BDF8] font-bold">80% (96 occupied)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30">
                    Open &bull; ANPR Active
                  </span>
                </td>
                <td className="py-3 text-[#38BDF8] font-medium">99.9% Nominal</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">Financial District Plaza</td>
                <td className="py-3">80 bays</td>
                <td className="py-3 text-amber-400 font-bold">85% (68 occupied)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30">
                    Open &bull; ANPR Active
                  </span>
                </td>
                <td className="py-3 text-[#38BDF8] font-medium">100% Nominal</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-white">Tech District EcoPark</td>
                <td className="py-3">150 bays</td>
                <td className="py-3 text-[#38BDF8] font-bold">70% (105 occupied)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30">
                    Open &bull; ANPR Active
                  </span>
                </td>
                <td className="py-3 text-[#38BDF8] font-medium">99.8% Nominal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
