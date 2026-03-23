"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  visible,
  onClose,
  duration = 2500,
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

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
