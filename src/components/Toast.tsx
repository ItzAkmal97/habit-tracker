import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  colors?: string;
}

const Toast = ({ message, isVisible, onClose, colors }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      },1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`px-6 py-4 rounded-lg shadow-lg border flex items-center gap-2 animate-fade-in-up duration-500 ${colors}`}
    >
      {message}
    </div>
  );
};

export default Toast;
