import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500",
    secondary: "text-slate-200 bg-slate-800 hover:bg-slate-700 focus:ring-slate-500 border border-slate-700",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-500",
    danger: "text-white bg-red-600 hover:bg-red-500 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
      {children}
    </button>
  );
};
