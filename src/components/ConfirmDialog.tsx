/**
 * ConfirmDialog — Modal de confirmación de acciones destructivas.
 *
 * Reemplaza window.confirm() con un diálogo on-brand, accesible y asíncrono.
 *
 * Uso:
 *   const { confirm, ConfirmDialogRenderer } = useConfirmDialog();
 *
 *   // En un handler:
 *   const ok = await confirm({
 *     title: '¿Eliminar servicios?',
 *     message: 'Esta acción no se puede deshacer.',
 *     confirmLabel: 'Sí, eliminar',
 *     variant: 'danger',
 *   });
 *   if (ok) { ... ejecutar acción ... }
 *
 *   // En el JSX del componente:
 *   <ConfirmDialogRenderer />
 */

import { useState, useCallback, type ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle, type LucideIcon } from 'lucide-react';
import Modal from './ui/Modal';
import Button, { type ButtonVariant } from './ui/Button';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface DialogState extends Required<Omit<ConfirmOptions, 'message'>> {
  message: string | undefined;
  resolve: (confirmed: boolean) => void;
}

interface VariantConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  confirmVariant: ButtonVariant;
}

// ─── Icono y color según variante ─────────────────────────────────────────────
const VARIANT_CONFIG: Record<ConfirmVariant, VariantConfig> = {
  danger: {
    icon:        AlertTriangle,
    iconColor:   'text-danger',
    iconBg:      'bg-danger-light',
    confirmVariant: 'danger',
  },
  warning: {
    icon:        AlertTriangle,
    iconColor:   'text-warning',
    iconBg:      'bg-warning-light',
    confirmVariant: 'primary',
  },
  info: {
    icon:        Info,
    iconColor:   'text-info',
    iconBg:      'bg-info-light',
    confirmVariant: 'secondary',
  },
  success: {
    icon:        CheckCircle,
    iconColor:   'text-success',
    iconBg:      'bg-success-light',
    confirmVariant: 'secondary',
  },
};

// ─── Hook useConfirmDialog ─────────────────────────────────────────────────────
export function useConfirmDialog(): {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  ConfirmDialogRenderer: () => ReactNode;
} {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const confirm = useCallback(
    ({ title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'danger' }: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setDialogState({ title, message, confirmLabel, cancelLabel, variant, resolve });
      }),
    []
  );

  const handleConfirm = () => {
    dialogState?.resolve(true);
    setDialogState(null);
  };

  const handleCancel = () => {
    dialogState?.resolve(false);
    setDialogState(null);
  };

  // Renderer que se monta una sola vez en el componente padre
  const ConfirmDialogRenderer = (): ReactNode => {
    if (!dialogState) return null;
    const cfg = VARIANT_CONFIG[dialogState.variant];
    const Icon = cfg.icon;

    return (
      <Modal
        isOpen
        onClose={handleCancel}
        size="sm"
        showClose={false}
        closeOnBackdrop={false}
      >
        <div className="flex flex-col items-center text-center py-2">
          {/* Icono */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${cfg.iconBg}`}>
            <Icon size={28} className={cfg.iconColor} aria-hidden="true" />
          </div>

          {/* Título */}
          <h3 className="text-lg font-black text-gray-900 mb-2">
            {dialogState.title}
          </h3>

          {/* Mensaje */}
          {dialogState.message && (
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              {dialogState.message}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 w-full">
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={handleCancel}
            >
              {dialogState.cancelLabel}
            </Button>
            <Button
              variant={cfg.confirmVariant}
              size="md"
              fullWidth
              onClick={handleConfirm}
              id="confirm-dialog-action"
            >
              {dialogState.confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return { confirm, ConfirmDialogRenderer };
}

export default useConfirmDialog;
