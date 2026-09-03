import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  glow = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200
        ${
          glass
            ? 'bg-[#111827]/95 backdrop-blur-xl border-[#1F2937] shadow-xl shadow-black/40'
            : 'bg-[#111827] border-[#1F2937] shadow-lg shadow-black/30'
        }
        ${glow ? 'ring-1 ring-[#2563EB]/20 shadow-[0_0_35px_-5px_rgba(37,99,235,0.2)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
