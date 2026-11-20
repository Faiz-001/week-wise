const MEALS = [
  ['breakfast', 'Breakfast', '🌅'],
  ['lunch', 'Lunch', '☀️'],
  ['dinner', 'Dinner', '🌙'],
];

const FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

export default function WeekGrid({ days }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {days.map((d, idx) => {
        const weekend = d.day === 'Sat' || d.day === 'Sun';
        return (
          <article
            key={d.day}
            className="reveal card-lift overflow-hidden rounded-2xl border border-white bg-white/90 shadow-sm ring-1 ring-stone-200/70"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <header className={`flex items-center justify-between px-4 py-2.5 ${weekend ? 'bg-sun-100' : 'bg-leaf-50'}`}>
              <h3 className="font-display text-base font-semibold">{FULL[d.day] ?? d.day}</h3>
              <span className="text-xs font-semibold text-stone-500">{weekend ? 'Weekend' : 'Weekday'}</span>
            </header>

            <ul className="space-y-2.5 px-4 py-3 text-sm">
              {MEALS.map(([key, name, icon]) => (
                <li key={key} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-base" aria-hidden>{icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">{name}</div>
                    <div className="leading-snug">{d.meals[key].name}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                    {d.meals[key].prepMinutes}m
                  </span>
                </li>
              ))}
            </ul>

            {d.chores.length > 0 && (
              <div className="space-y-1.5 border-t border-dashed border-stone-200 px-4 py-3">
                {d.chores.map((c, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-sun-100 px-2.5 py-1.5 text-xs font-medium text-amber-900">
                    <span>🧹 {c.name}</span>
                    <span className="tabular-nums">{c.start}–{c.end}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}