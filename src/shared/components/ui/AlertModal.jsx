import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AlertModal = ({ isOpen, onClose, icon, title, message, actionLabel, actionTo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
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
        {icon && <div className="text-5xl mb-4">{icon}</div>}

        {title && (
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {title}
          </h3>
        )}

        <p className="text-text-secondary mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="btn-ghost text-sm !py-2 !px-6"
          >
            Tutup
          </button>
          {actionLabel && actionTo && (
            <button
              onClick={() => { navigate(actionTo); onClose(); }}
              className="btn-primary text-sm !py-2 !px-6"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
