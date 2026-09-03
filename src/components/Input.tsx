import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  allowPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      type = 'text',
      className = '',
      allowPasswordToggle = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const isPasswordField = type === 'password' || allowPasswordToggle;
    const computedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-white"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={computedType}
            disabled={disabled}
            className={`w-full rounded-xl border bg-[#111827] text-white placeholder:text-[#94A3B8] py-3 px-3.5 text-sm transition-all duration-150 outline-none
              ${leftIcon ? 'pl-10' : 'pl-3.5'}
              ${isPasswordField || rightElement ? 'pr-11' : 'pr-3.5'}
              ${
                error
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                  : 'border-[#1F2937] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/25'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed bg-[#0F172A]' : ''}
              ${className}
            `}
            {...props}
          />

          {isPasswordField ? (
            <button
              type="button"
              tabIndex={0}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 p-1 rounded-lg text-[#94A3B8] hover:text-[#38BDF8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-[#38BDF8]" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          ) : rightElement ? (
            <div className="absolute right-3 flex items-center">{rightElement}</div>
          ) : null}
        </div>

        {error && (
          <p className="text-xs font-medium text-red-400 flex items-center gap-1 mt-1 animate-fadeIn">
            <span>&bull;</span>
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[#94A3B8] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
