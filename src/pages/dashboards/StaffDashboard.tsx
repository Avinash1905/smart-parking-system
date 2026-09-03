import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wrench, LogOut, Radio } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const StaffDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [barrierState, setBarrierState] = useState<'AUTO' | 'OPEN_OVERRIDE' | 'LOCKED'>('AUTO');
  const recentScans = [
    { plate: '6KLM-102', time: '12:14:02', gate: 'North Entry 01', status: 'Approved (Pass Holder)', success: true },
    { plate: '8ABC-991', time: '12:11:45', gate: 'South Entry 02', status: 'Approved (App Driver)', success: true },
    { plate: 'UNKNOWN-PL', time: '12:08:19', gate: 'North Entry 01', status: 'Manual Review Required', success: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#080F1C]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F172A] border border-[#1F2937] text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E40AF]/40 border border-[#2563EB]/40 text-[#38BDF8] flex items-center justify-center font-bold text-2xl">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Facility Operations Console</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#2563EB] text-white">
                Staff Role
              </span>
            </div>
            <p className="text-[#94A3B8] text-sm mt-0.5">
              Duty Officer: <span className="text-white font-semibold">{user?.name || user?.username}</span> &bull; {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="danger" size="md" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gate Barrier Controls */}
        <Card className="p-6 space-y-5 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Barrier Gate Controls</h2>
            <Radio className="w-5 h-5 text-[#38BDF8] animate-pulse" />
          </div>

          <div className="p-4 rounded-xl bg-[#080F1C] border border-[#1F2937] space-y-2">
            <p className="text-xs text-[#94A3B8]">Current Barrier Mode</p>
            <p className="text-lg font-bold text-[#38BDF8]">{barrierState}</p>
          </div>

          <div className="space-y-2">
            <Button
              variant={barrierState === 'AUTO' ? 'primary' : 'outline'}
              size="md"
              className="w-full justify-start"
              onClick={() => setBarrierState('AUTO')}
            >
              Mode: Smart Auto-ANPR
            </Button>
            <Button
              variant={barrierState === 'OPEN_OVERRIDE' ? 'primary' : 'outline'}
              size="md"
              className="w-full justify-start text-amber-400"
              onClick={() => setBarrierState('OPEN_OVERRIDE')}
            >
              Manual Emergency Open
            </Button>
          </div>
        </Card>

        {/* Live Plate Scanners */}
        <Card className="lg:col-span-2 p-6 space-y-5 bg-[#111827] border-[#1F2937]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white">Live ANPR Gate Feed</h2>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30">
              Scanners Active
            </span>
          </div>

          <div className="space-y-3">
            {recentScans.map((scan, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#1F2937] bg-[#080F1C] text-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      scan.success ? 'bg-[#2563EB]' : 'bg-red-500 animate-ping'
                    }`}
                  />
                  <div>
                    <p className="font-bold font-mono text-white">{scan.plate}</p>
                    <p className="text-xs text-[#94A3B8]">{scan.gate} &bull; {scan.time}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      scan.success
                        ? 'bg-[#1E40AF]/30 text-[#38BDF8] border border-[#2563EB]/30'
                        : 'bg-red-950 text-red-400 border border-red-900/40'
                    }`}
                  >
                    {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
