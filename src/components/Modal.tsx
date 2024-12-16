import React from "react";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 inset-0 z-50 flex justify-center overflow-x-hidden overflow-y-auto">
      {/* Backdrop Overlay with Blur */}
      <div
        className="fixed inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-auto animate-fade-in">
        <div className="relative dark:bg-gray-700 bg-white rounded-xl shadow-2xl border-2 overflow-hidden">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-navy/10 bg-gold-light">
            <h3 className="text-xl font-bold text-navy">{title}</h3>
            <button
              onClick={onClose}
              className="text-navy/70 hover:text-navy transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4">{children}</div>

          {/* Modal Footer */}
          <div className="flex justify-end p-4 border-t border-navy/10 bg-gold-light">
            <button
              onClick={onClose}
              className="bg-black hover:bg-slate-800 text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
