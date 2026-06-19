import { useState, useMemo } from "react";
import Button from "./Button";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const DayBtn = ({ day, selected, inRange, onClick }) => {
  const isToday = day.toDateString() === new Date().toDateString();
  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={[
        "w-9 h-9 text-sm font-medium rounded transition-all cursor-pointer",
        selected
          ? "bg-brand-deep text-white shadow-[2px_2px_0px_0px_var(--color-brand-deep)]"
          : inRange
            ? "bg-brand-subtle text-text-primary"
            : "text-text-primary hover:bg-brand-subtle",
        isToday && !selected ? "border-[2px] border-brand-deep" : "",
      ].join(" ")}
    >
      {day.getDate()}
    </button>
  );
};

const NeoCalendar = ({ startDate, endDate, onStartChange, onEndChange, onClose }) => {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < firstDayOfWeek; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(viewYear, viewMonth, d));
    return result;
  }, [viewYear, viewMonth, daysInMonth, firstDayOfWeek]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    if (!startDate) {
      onStartChange(day);
      onEndChange(day);
    } else if (day >= startDate) {
      onEndChange(day);
    } else {
      onStartChange(day);
      onEndChange(day);
    }
  };

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    return day >= startDate && day <= endDate;
  };

  const quickSelect = (daysAgo) => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    start.setHours(0, 0, 0, 0);
    onStartChange(start);
    onEndChange(end);
  };

  const clearFilter = () => {
    onStartChange(null);
    onEndChange(null);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="card !p-5 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-text-primary">Pilih Tanggal</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-lg font-bold text-text-muted hover:text-text-primary leading-none"
        >
          &times;
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3 min-h-[36px]">
        <Button type="button" variant="ghost" onClick={() => quickSelect(7)}>
          7 Hari
        </Button>
        <Button type="button" variant="ghost" onClick={() => quickSelect(30)}>
          30 Hari
        </Button>
        <button
          type="button"
          onClick={clearFilter}
          className={`text-xs text-danger hover:underline ml-auto transition-opacity ${startDate || endDate ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          Hapus
        </button>
      </div>

      <div className="text-xs text-text-muted mb-3 min-h-[18px]">
        {startDate && endDate && startDate.toDateString() === endDate.toDateString()
          ? formatDate(startDate)
          : `${formatDate(startDate)} — ${formatDate(endDate)}`}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold hover:bg-brand-subtle transition-colors"
        >
          &larr;
        </button>
        <span className="text-sm font-bold text-text-primary">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 border-[2px] border-brand-deep rounded text-brand-deep font-bold hover:bg-brand-subtle transition-colors"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="w-9 h-7 flex items-center justify-center text-[11px] font-semibold text-text-muted">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) =>
          day ? (
            <DayBtn
              key={i}
              day={day}
              selected={!!(startDate && day.toDateString() === startDate.toDateString()) || !!(endDate && day.toDateString() === endDate.toDateString())}
              inRange={isInRange(day)}
              onClick={handleDayClick}
            />
          ) : (
            <div key={i} />
          )
        )}
      </div>

      <p className="text-xs text-text-muted mt-3 text-center min-h-[18px]">
        {startDate && endDate && startDate.toDateString() !== endDate.toDateString()
          ? `${startDate.toLocaleDateString("id-ID")} — ${endDate.toLocaleDateString("id-ID")}`
          : startDate
            ? `${startDate.toLocaleDateString("id-ID")} — klik tanggal lain untuk range`
            : "Klik tanggal untuk filter"}
      </p>
    </div>
  );
};

export default NeoCalendar;
