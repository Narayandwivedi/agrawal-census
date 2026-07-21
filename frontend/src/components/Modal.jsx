import { useState, useEffect, useCallback } from 'react';

export default function Modal({ isOpen, onClose, children, className }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, handleClose]);

  useEffect(() => {
    if (mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center p-4 transition-all duration-300 ease-out sm:items-center ${
        visible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none'
      }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-y-auto bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-out ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${className || 'max-w-[900px] max-h-[90vh]'}`}
      >
        {children}
      </div>
    </div>
  );
}
