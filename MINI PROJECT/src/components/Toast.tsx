import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        let bgColor = 'bg-gray-800 border-gray-700 text-gray-200';
        let icon = <Info className="w-5 h-5 text-blue-400" />;

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-950/90 border-emerald-700/60 text-emerald-100';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-950/90 border-rose-700/60 text-rose-100';
          icon = <AlertCircle className="w-5 h-5 text-rose-400" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950/90 border-amber-700/60 text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bgColor}`}
          >
            <div className="flex items-center space-x-3">
              <span className="shrink-0">{icon}</span>
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 shrink-0 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
