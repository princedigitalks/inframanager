import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-[#E2E8F0] flex flex-col"
          >
            <div className="p-8 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8F9FB] flex-shrink-0">
              <h3 className="text-xl font-bold text-[#1A1C1E]">{title}</h3>
              <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-[#E2E8F0]">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
