export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#1F4D3F] to-[#2D6B56] text-white hover:opacity-90 focus:ring-[#1F4D3F]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 border-gray-200 text-gray-700 hover:border-[#1F4D3F] hover:text-[#1F4D3F] focus:ring-[#1F4D3F]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Input({ 
  label, 
  error,
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input 
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#1F4D3F]/20 focus:border-[#1F4D3F] ${error ? 'border-red-500' : 'border-gray-200'}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'premium' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    premium: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title?: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success', isVisible, onClose }: {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}) {
  if (!isVisible) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${colors[type]} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <span>{message}</span>
        <button onClick={onClose} className="hover:opacity-80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function Avatar({ src, name, size = 'md' }: { src?: string | null; name?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-lg' };
  const initial = name?.charAt(0).toUpperCase() || '?';

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#1F4D3F] to-[#2D6B56] flex items-center justify-center text-white font-semibold`}>
      {initial}
    </div>
  );
}