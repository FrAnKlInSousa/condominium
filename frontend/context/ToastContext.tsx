"use client";

import { createContext, useContext, useState } from "react";
import Toast from "@/components/Toast";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  function showToast(msg: string) {
    setVisible(false);

    setTimeout(() => {
      setMessage(msg);
      setVisible(true);
    }, 10);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        message={message}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro do ToastProvider");
  }

  return context;
}
