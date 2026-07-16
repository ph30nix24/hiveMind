import { createContext, useCallback, useRef, useState } from "react";
import Toast from "../Toast";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="fixed top-8 right-8 z-9000 flex flex-col gap-3 max-[600px]:bottom-4 max-[600px]:right-4 max-[600px]:left-4"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

