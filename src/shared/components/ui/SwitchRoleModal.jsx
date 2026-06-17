const roleLabel = {
  SELLER: "Penjual",
  BUYER: "Pembeli",
};

const roleIcon = {
  SELLER: "🏪",
  BUYER: "🛍️",
};

const SwitchRoleModal = ({ role }) => {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="card !p-8 mx-4 flex flex-col items-center gap-4 min-w-[280px]">
        <span className="text-4xl">{roleIcon[role]}</span>
        <p className="text-lg font-semibold text-text-primary text-center">
          Beralih ke {roleLabel[role]}
        </p>
        <div className="w-8 h-8 border-[3px] border-brand-deep border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Mohon tunggu sebentar...</p>
      </div>
    </div>
  );
};

export default SwitchRoleModal;
