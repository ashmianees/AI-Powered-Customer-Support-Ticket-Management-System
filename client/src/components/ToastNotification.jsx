import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ToastNotification = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>
      {toast.type === 'error' ? (
        <AlertCircle size={20} color="#ef4444" />
      ) : (
        <CheckCircle2 size={20} color="#22c55e" />
      )}
      <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
    </div>
  );
};

export default ToastNotification;
