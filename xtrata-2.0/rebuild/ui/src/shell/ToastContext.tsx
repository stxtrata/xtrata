import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { severityOf, toDisplayError } from './errors';

export type ToastKind = 'info' | 'success' | 'warn' | 'error';

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
  /** Taxonomy code when the toast came from an error. */
  code?: string;
}

export interface ToastApi {
  toasts: Toast[];
  notify: (toast: Omit<Toast, 'id'>) => string;
  /** Push a toast built from the client error taxonomy. */
  notifyError: (error: unknown, context?: string) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

let counter = 0;
const nextId = (): string => `toast-${(counter += 1)}`;

export const ToastProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = nextId();
    setToasts((current) => [...current, { ...toast, id }]);
    return id;
  }, []);

  const notifyError = useCallback(
    (error: unknown, context?: string) => {
      const display = toDisplayError(error);
      const id = nextId();
      setToasts((current) => [
        ...current,
        {
          id,
          kind: severityOf(display),
          title: context ? `${context}: ${display.code}` : display.code,
          body: `${display.userMessage} ${display.detail}`.trim(),
          code: display.code
        }
      ]);
      return id;
    },
    []
  );

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo<ToastApi>(
    () => ({ toasts, notify, notifyError, dismiss, clear }),
    [toasts, notify, notifyError, dismiss, clear]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToasts = (): ToastApi => {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToasts must be used inside <ToastProvider>');
  return value;
};

export const ToastViewport = (): JSX.Element | null => {
  const { toasts, dismiss } = useToasts();
  if (toasts.length === 0) return null;
  return (
    <div className="toasts" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.kind}`}
          role={toast.kind === 'error' ? 'alert' : 'status'}
        >
          <div className="toast__title">
            <span>{toast.title}</span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => dismiss(toast.id)}
              aria-label={`Dismiss ${toast.title}`}
            >
              ×
            </button>
          </div>
          {toast.body ? <div className="toast__body">{toast.body}</div> : null}
        </div>
      ))}
    </div>
  );
};
