import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { drawerVariants } from '../utils/motion';

export const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const variants = drawerVariants(position);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Side Drawer */}
          <div className={`fixed inset-y-0 ${position === 'right' ? 'right-0' : 'left-0'} flex max-w-full`}>
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`w-[85vw] ${sizeClasses[size] || sizeClasses.md} bg-white border-l border-slate-200 shadow-2xl flex flex-col`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate font-display">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="w-10 h-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-700">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
