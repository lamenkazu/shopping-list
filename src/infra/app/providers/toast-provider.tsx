import { UIToast, type UIToastTone } from '@infra/shared/ui/toast';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

type ToastState = {
  id: number;
  message: string;
  tone: UIToastTone;
};

type ToastContextValue = {
  showToast: (message: string, tone?: UIToastTone) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, tone: UIToastTone = 'info') => {
      setToast({
        id: Date.now(),
        message,
        tone,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, 3500);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast ? (
        <View className="pointer-events-none absolute bottom-6 left-0 right-0 z-50">
          <View className="pointer-events-auto">
            <UIToast key={toast.id} message={toast.message} tone={toast.tone} onClose={hideToast} />
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
