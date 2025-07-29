// src/components/ui/use-toast.ts
import React from 'react';
import { useState, useCallback } from 'react';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
}

const TOAST_DURATION = 5000;

// Store global de toasts (simple para este ejemplo)
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const toast = ({ title, description, variant = 'default', duration = TOAST_DURATION }: ToastProps) => {
  const id = generateId();
  const newToast: Toast = {
    id,
    title,
    description,
    variant,
    duration
  };

  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener(toasts));
};

export const useToast = () => {
  const [toastList, setToastList] = useState<Toast[]>(toasts);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  const dismissAll = useCallback(() => {
    toasts = [];
    listeners.forEach(listener => listener(toasts));
  }, []);

  // Subscribe to changes
  React.useEffect(() => {
    const unsubscribe = subscribe(setToastList);
    return unsubscribe;
  }, [subscribe]);

  return {
    toasts: toastList,
    toast,
    dismiss,
    dismissAll
  };
};

// Export both named and default
export { useToast as default };