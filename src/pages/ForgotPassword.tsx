import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Info } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#080F1C] bg-grid-pattern relative">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-sm text-[#94A3B8]">
            SmartPark account recovery
          </p>
        </div>

        <Card glass className="p-6 sm:p-8 text-center space-y-5 bg-[#111827] border-[#1F2937]">
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1F2937] text-[#38BDF8] text-xs sm:text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="text-left">
              Password recovery services will be connected in future backend integration. Use demo credentials on the Login Page to sign in.
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
