import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ICON_MAP = {
  success: <CheckCircle2 size={15} className="text-emerald-400" />,
  error:   <AlertCircle  size={15} className="text-red-400" />,
  warning: <AlertTriangle size={15} className="text-yellow-400" />,
  info:    <Info size={15} style={{ color: 'var(--gold)' }} />,
};

const BORDER_MAP = {
  success: 'rgba(52,211,153,0.25)',
  error:   'rgba(248,113,113,0.25)',
  warning: 'rgba(250,204,21,0.25)',
  info:    'var(--gold-border)',
};

const Toast = ({ id, message, type = 'info', removeToast }) => (
  <div
    className="toast-item"
    style={{ borderColor: BORDER_MAP[type] || BORDER_MAP.info }}
  >
    <div className="shrink-0">{ICON_MAP[type] || ICON_MAP.info}</div>
    <p className="flex-1 text-[13.5px] font-medium leading-snug">{message}</p>
    <button
      onClick={() => removeToast(id)}
      className="shrink-0 transition-colors"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      aria-label="Dismiss"
    >
      <X size={14} />
    </button>
  </div>
);

const ToastContainer = ({ toasts, removeToast }) => (
  <div
    className="fixed bottom-5 right-5 flex flex-col gap-2 pointer-events-none"
    style={{ zIndex: 'var(--z-toast)' }}
  >
    {toasts.map((toast) => (
      <div key={toast.id} className="pointer-events-auto">
        <Toast {...toast} removeToast={removeToast} />
      </div>
    ))}
  </div>
);

export default ToastContainer;
