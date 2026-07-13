import { useState, useCallback } from 'react';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertState {
  type: AlertType;
  title: string;
  message: string;
}

export function useAlert() {
  const [alert, setAlertState] = useState<AlertState | null>(null);
  const [loading, setLoadingState] = useState<{ show: boolean; message?: string }>({ show: false });

  const showAlert = useCallback((type: AlertType, title: string, message: string) => {
    setAlertState({ type, title, message });
  }, []);

  const hideAlert = useCallback(() => setAlertState(null), []);

  const showLoading = useCallback((message = 'Please wait…') => {
    setLoadingState({ show: true, message });
  }, []);

  const hideLoading = useCallback(() => setLoadingState({ show: false }), []);

  return { alert, showAlert, hideAlert, loading, showLoading, hideLoading };
}
