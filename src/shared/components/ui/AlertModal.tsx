import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title?: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

const AlertModal = ({ isOpen, onClose, icon, title, message, actionLabel, actionTo, onAction }: AlertModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card max-w-sm w-full text-center animate-[fadeIn_0.15s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-brand-subtle/30 text-brand-deep">
            {icon}
          </div>
        )}

        {title && (
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {title}
          </h3>
        )}

        <p className="text-text-secondary mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={onClose} variant="ghost" size="sm">
            Tutup
          </Button>
          {actionLabel && (actionTo || onAction) && (
            <Button
              onClick={() => {
                if (onAction) onAction();
                else if (actionTo) navigate(actionTo);
                onClose();
              }}
              variant="primary"
              size="sm"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
