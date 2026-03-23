"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  type?: ToastType;
};

export default function Toast({
  message,
  visible,
  onClose,
  duration = 2500,
  type = "success",
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, message, duration, onClose]);

  if (!show) return null;

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg animate-fade-in ${bgColor}`}
    >
      {message}
    </div>
  );
}
