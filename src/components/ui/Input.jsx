import React, { forwardRef, useId } from 'react';

/**
 * Input — Campo de texto del Design System KunaPet.
 *
 * Soporta:
 *  - label con asociación semántica automática (useId)
 *  - ícono a la izquierda y/o derecha
 *  - estado de error con mensaje
 *  - estado disabled
 *  - variante password (el toggle lo maneja el padre)
 *  - hint text
 *
 * @param {string}           label       — Etiqueta visible del campo
 * @param {string}           error       — Mensaje de error (activa error state)
 * @param {string}           hint        — Texto de ayuda bajo el campo
 * @param {React.ReactNode}  leftIcon    — Ícono izquierda (Lucide / react-icons)
 * @param {React.ReactNode}  rightElement — Elemento derecha (botón toggle, ícono)
 * @param {boolean}          required    — Agrega asterisco al label
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightElement,
    required = false,
    disabled = false,
    className = '',
    id: externalId,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId  = `${inputId}-hint`;

  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-800 select-none"
        >
          {label}
          {required && (
            <span className="ml-1 text-brand-primary" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">
        {/* Left Icon */}
        {leftIcon && (
          <span
            className="absolute left-3.5 flex items-center pointer-events-none text-gray-400"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={[
            hasError ? errorId : null,
            hint ? hintId : null,
          ]
            .filter(Boolean)
            .join(' ') || undefined}
          className={[
            // Base
            'w-full bg-gray-100 text-gray-900 text-sm rounded-xl',
            'border transition-all duration-200',
            'placeholder:text-gray-400',
            'focus:outline-none focus:bg-white focus:ring-2 focus:ring-offset-0',
            // Padding adaptado a íconos
            leftIcon ? 'pl-10' : 'pl-4',
            rightElement ? 'pr-10' : 'pr-4',
            'py-3',
            // Estado normal
            !hasError && !disabled
              ? 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'
              : '',
            // Estado error
            hasError
              ? 'border-danger bg-danger-light focus:border-danger focus:ring-danger/20'
              : '',
            // Estado disabled
            disabled
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : '',
            className,
          ].join(' ')}
          {...rest}
        />

        {/* Right element (icon/button) */}
        {rightElement && (
          <span className="absolute right-3.5 flex items-center">
            {rightElement}
          </span>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Hint text */}
      {hint && !hasError && (
        <p id={hintId} className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
});

export default Input;
