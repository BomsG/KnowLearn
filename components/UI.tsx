
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon, 
  className = '', 
  style,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-2xl";
  
  const variants = {
    primary: "text-white shadow-lg hover:brightness-110",
    secondary: "bg-gray-900 text-white hover:bg-black",
    outline: "bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50",
    ghost: "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg"
  };

  // If variant is primary and no style provided, use default brand color
  const dynamicStyle = variant === 'primary' && !style?.backgroundColor ? { backgroundColor: 'var(--brand)' } : style;

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={dynamicStyle}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode, label?: string }>(
  ({ icon, label, className = '', ...props }, ref) => (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{label}</label>}
      <div className="relative group">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">{icon}</div>}
        <input
          ref={ref}
          className={`w-full ${icon ? 'pl-14' : 'px-6'} py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium ${className}`}
          {...props}
        />
      </div>
    </div>
  )
);

// Added style prop to Card component
export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void, style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
  <div 
    onClick={onClick}
    style={style}
    className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-xl hover:border-indigo-100' : ''} ${className}`}
  >
    {children}
  </div>
);
