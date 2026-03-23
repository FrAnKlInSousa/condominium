"use client";

import { createContext, useContext, useState } from "react";
import Toast from "@/components/Toast";

type ToastType = "success" | "error";

type ToastState = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(message: string, type: ToastType = "success") {
    setToast({ message, type });
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        message={toast?.message || ""}
        visible={!!toast}
        onClose={() => setToast(null)}
        type={toast?.type}
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
