
import { createContext, useContext, useMemo, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastCtx = createContext({ notify: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [state, setState] = useState({ open: false, message: '', severity: 'info' });

  const notify = (message, severity = 'info') =>
    setState({ open: true, message, severity });

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={3000}
        onClose={() => setState(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={state.severity} onClose={() => setState(s => ({ ...s, open: false }))} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </ToastCtx.Provider>
  );
}
