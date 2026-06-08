'use client';

import { cn } from '@/lib/ui';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:bg-emerald-900 disabled:text-emerald-700',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30',
  ghost: 'bg-transparent text-white/80 hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-500 disabled:bg-red-950 disabled:text-red-700',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-colors disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
}
