import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Modal — Componente de diálogo del Design System KunaPet.
 *
 * Características:
 *  - Renderiza en un Portal (fuera del árbol DOM normal)
 *  - Cierra con Escape
 *  - Cierra al hacer click en el backdrop
 *  - Bloquea scroll del body mientras está abierto
 *  - Completamente accesible (role=dialog, aria-modal, aria-labelledby)
 *  - Animación fade-in-scale
 *
 * @param {boolean}          isOpen      — Controla visibilidad
 * @param {() => void}       onClose     — Callback para cerrar
 * @param {string}           title       — Título del modal (para aria-labelledby)
 * @param {'sm'|'md'|'lg'|'xl'} size    — Ancho máximo
 * @param {boolean}          showClose   — Muestra botón X (default true)
 */

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
}) {
  // Escape key listener
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    },
    [isOpen, onClose]
  );

  // Block body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalId = 'kunapet-modal-title';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? modalId : undefined}
        className={[
          'relative w-full bg-white rounded-3xl shadow-modal',
          'flex flex-col max-h-[90vh] overflow-hidden',
          'animate-fade-in-scale',
          SIZES[size] ?? SIZES.md,
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border shrink-0">
            {title && (
              <h2
                id={modalId}
                className="text-lg font-bold text-gray-900 leading-tight"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="ml-auto p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer (opcional) */}
        {footer && (
          <div className="px-6 py-4 border-t border-surface-border shrink-0 bg-surface-secondary rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
