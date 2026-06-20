/**
 * StatCard component untuk menampilkan statistik di dashboard.
 * Mendukung dua variant:
 *   - "badge"  : kotak berwarna + label + value (Seller, Driver)
 *   - "simple" : label kecil uppercase + value besar (Admin)
 *
 * @param {Object} props
 * @param {string} props.label - Label statistik
 * @param {string|number} props.value - Nilai statistik
 * @param {"badge"|"simple"} [props.variant="simple"] - Tipe tampilan
 * @param {string} [props.color] - Warna: class background (badge) atau text (simple)
 * @param {string} [props.prefix] - Prefix value (e.g. "Rp") - hanya untuk variant simple
 */
const StatCard = ({ label, value, variant = "simple", color, prefix }) => {
  if (variant === "badge") {
    return (
      <div className="card !p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color || "bg-brand-deep"} flex items-center justify-center`}>
          <span className="text-white text-lg font-bold">{value}</span>
        </div>
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-xl font-bold text-text-primary">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || "text-text-primary"}`}>
        {prefix || ""}{typeof value === "number" ? value.toLocaleString("id-ID") : value ?? 0}
      </p>
    </div>
  );
};

export default StatCard;
