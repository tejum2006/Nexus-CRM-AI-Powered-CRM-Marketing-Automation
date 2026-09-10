import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ICON_MAP = {
  success: <CheckCircle2 size={16} className="text-success" />,
  error:   <AlertCircle  size={16} className="text-danger" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  info:    <Info size={16} className="text-info" />,
};

const BORDER_MAP = {
  success: 'border-success/20',
  error:   'border-danger/20',
  warning: 'border-warning/20',
  info:    'border-info/20',
};

const BG_MAP = {
  success: 'bg-success/5',
  error:   'bg-danger/5',
  warning: 'bg-warning/5',
  info:    'bg-info/5',
};

const Toast = ({ id, message, type = 'info', removeToast }) => (
  <div
    className={`flex items-start gap-3 p-4 rounded-xl border bg-nexus-900 shadow-electric-md animate-fade-in ${BORDER_MAP[type] || BORDER_MAP.info}`}
  >
    <div className={`shrink-0 mt-0.5 p-1 rounded-full ${BG_MAP[type] || BG_MAP.info}`}>
      {ICON_MAP[type] || ICON_MAP.info}
    </div>
    <p className="flex-1 text-sm font-medium text-nexus-100 leading-snug">{message}</p>
    <button
      onClick={() => removeToast(id)}
      className="shrink-0 p-1 text-nexus-400 hover:text-white transition-colors"
      aria-label="Dismiss"
    >
      <X size={14} />
    </button>
  </div>
);

const ToastContainer = ({ toasts, removeToast }) => (
  <div
    className="fixed bottom-6 right-6 flex flex-col gap-3 pointer-events-none w-80 max-w-[calc(100vw-48px)] z-50"
  >
    {toasts.map((toast) => (
      <div key={toast.id} className="pointer-events-auto">
        <Toast {...toast} removeToast={removeToast} />
      </div>
    ))}
  </div>
);

export default ToastContainer;
