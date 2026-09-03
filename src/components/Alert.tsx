import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  title,
  message,
  className = '',
}) => {
  const styles = {
    error: {
      container: 'bg-red-500/10 border-red-500/30 text-red-400',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#38BDF8]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />,
    },
    info: {
      container: 'bg-[#1E40AF]/20 border-[#2563EB]/30 text-[#38BDF8]',
      icon: <Info className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all duration-200 ${currentStyle.container} ${className}`}
    >
      {currentStyle.icon}
      <div className="flex-1 text-left">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <p className="leading-snug">{message}</p>
      </div>
    </div>
  );
};
