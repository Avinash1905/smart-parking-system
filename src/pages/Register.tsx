import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const Register: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#080F1C] bg-grid-pattern relative">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 mb-2">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Create an Account
          </h1>
          <p className="text-sm text-[#94A3B8]">
            Join SmartPark for effortless urban mobility
          </p>
        </div>

        <Card glass className="p-6 sm:p-8 text-center space-y-5 bg-[#111827] border-[#1F2937]">
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] text-[#38BDF8] text-xs sm:text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="text-left">
              Registration system is currently in closed beta test. Please use one of the temporary demo accounts on the Login Page.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link to="/login" className="block">
              <Button variant="primary" size="lg" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Return to Login</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
