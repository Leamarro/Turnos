<div className="grid grid-cols-7 gap-2 sm:gap-4 mt-4">
  {days.map((day, index) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateKey = date.toISOString().split("T")[0];
    const isToday = date.toDateString() === today.toDateString();
    const dayAppointments = appointments.filter(a => a.date.startsWith(dateKey));

    return (
      <button
        key={index}
        onClick={() => handleDayClick(date)}
        className={`p-3 rounded-xl border text-center transition-all shadow-soft ${
          isToday
            ? "bg-[var(--color-accent)] font-semibold"
            : "bg-white hover:bg-[var(--color-accent)]/40"
        }`}
      >
        <span>{day}</span>
        {dayAppointments.length > 0 && (
          <div className="mt-1 text-xs text-gray-600">
            {dayAppointments.length} turno(s)
          </div>
        )}
      </button>
    );
  })}
</div>
