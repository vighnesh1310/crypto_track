// ✅ components/ProfileModal.jsx (with outside click + escape support)
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Profile } from '../pages/Profile';

export function ProfileModal({ isOpen, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleOutsideClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleEscapeKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg animate-fadeIn p-6"
      >
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-white hover:text-red-500"
          onClick={onClose}
        >
          <X size={22} />
        </button>
        <Profile inModal />
      </div>
    </div>,
    document.body
  );
}
