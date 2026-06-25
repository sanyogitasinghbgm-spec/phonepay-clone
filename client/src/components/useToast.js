import { useCallback, useState } from 'react';

// Lightweight toast hook - each page manages its own toast state with this
export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type }), 3000);
  }, []);

  const closeToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  return { toast, showToast, closeToast };
};
