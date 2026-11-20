import { useState } from 'react';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultBusy = () =>
  Object.fromEntries(
    DAYS.map((d) => [d, { busy: !['Sat', 'Sun'].includes(d), start: '09:00', end: '17:00' }])
  );

const field =
  'w-full rounded-xl border border-stone-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-leaf-500 focus:bg-white focus:ring-4 focus:ring-leaf-100';
const label = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500';

export default function PlanForm({ onSubmit, loading, initial }) {
  const [busy, setBusy] = useState(initial?.busyUi ?? defaultBusy());
  const [diet, setDiet] = useState(initial?.diet ?? '');
  const [allergies, setAllergies] = useState(initial?.allergies ?? '');
  const [budget, setBudget] = useState(initial?.budget ?? 80);
  const [householdSize, setHouseholdSize] = useState(initial?.householdSize ?? 2);
  const [chores, setChores] = useState(
    initial?.chores ?? [
      { name: 'Laundry', minutes: 60 },
      { name: 'Clean bathroom', minutes: 30 },
    ]
  );

  const updateDay = (d, patch) => setBusy((b) => ({ ...b, [d]: { ...b[d], ...patch } }));
  const updateChore = (i, patch) =>
    setChores((c) => c.map((ch, idx) => (idx === i ? { ...ch, ...patch } : ch)));

  const selected = DAYS.filter((d) => busy[d].busy);
  const first = selected[0];

  function handleSubmit(e) {
    e.preventDefault();
    const busyPayload = {};
    for (const d of DAYS) {
      busyPayload[d] = busy[d].busy ? [{ start: busy[d].start, end: busy[d].end }] : [];
    }
    onSubmit(
      {
        busy: busyPayload,
        diet: diet.trim() || 'No restrictions',
        allergies: allergies.trim() || 'None',
        budget: Number(budget),
        householdSize: Number(householdSize),
        chores: chores
          .filter((c) => c.name.trim())
          .map((c) => ({ name: c.name.trim(), minutes: Number(c.minutes) || 30 })),
      },
      { busyUi: busy, diet, allergies, budget, householdSize, chores }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Busy days */}
      <section>
        <h2 className="font-display text-lg font-semibold">When are you busy?</h2>
        <p className="mb-3 text-sm text-stone-500">Tap the days you work or study.</p>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Busy days">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={busy[d].busy}
              onClick={() => updateDay(d, { busy: !busy[d].busy })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
                busy[d].busy
                  ? 'bg-leaf-600 text-white shadow-md shadow-leaf-600/25'
                  : 'bg-white text-stone-500 ring-1 ring-stone-200 hover:ring-leaf-400'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {first && (
          <div className="reveal mt-4 space-y-2 rounded-xl bg-leaf-50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <input type="time" value={busy[first].start} onChange={(e) => selected.forEach((d) => updateDay(d, { start: e.target.value }))} className={field + ' w-28!'} aria-label="Busy from" />
              <span className="text-stone-400">to</span>
              <input type="time" value={busy[first].end} onChange={(e) => selected.forEach((d) => updateDay(d, { end: e.target.value }))} className={field + ' w-28!'} aria-label="Busy until" />
            </div>
            <p className="text-xs text-stone-500">Applies to all selected days. Everything else counts as free time.</p>
          </div>
        )}
      </section>

      {/* Basics */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Weekly budget ($)</label>
          <input type="number" min="1" required value={budget} onChange={(e) => setBudget(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>People</label>
          <input type="number" min="1" max="12" required value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Diet</label>
          <input value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="vegetarian, high protein…" className={field} />
        </div>
        <div>
          <label className={label}>Allergies</label>
          <input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="peanuts, dairy…" className={field} />
        </div>
      </section>

      {/* Chores */}
      <section>
        <h2 className="font-display text-lg font-semibold">Chores to fit in</h2>
        <div className="mt-3 space-y-2">
          {chores.map((c, i) => (
            <div key={i} className="reveal flex items-center gap-2" style={{ animationDelay: `${i * 40}ms` }}>
              <input value={c.name} onChange={(e) => updateChore(i, { name: e.target.value })} placeholder="Chore" className={field} />
              <input type="number" min="5" max="240" value={c.minutes} onChange={(e) => updateChore(i, { minutes: e.target.value })} className={field + ' w-20!'} aria-label="Minutes" />
              <span className="text-xs text-stone-400">min</span>
              <button type="button" onClick={() => setChores((cs) => cs.filter((_, idx) => idx !== i))} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-clay-100 hover:text-clay-500" aria-label="Remove chore">
                ✕
              </button>
            </div>
          ))}
        </div>
        {chores.length < 15 && (
          <button type="button" onClick={() => setChores((cs) => [...cs, { name: '', minutes: 30 }])} className="mt-3 rounded-full border border-dashed border-leaf-400 px-4 py-1.5 text-sm font-semibold text-leaf-700 transition hover:bg-leaf-50 active:scale-95">
            + Add chore
          </button>
        )}
      </section>

      <button
        type="submit"
        disabled={loading}
        className="btn-sheen relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-leaf-600 to-leaf-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-leaf-600/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Planning your week…
          </span>
        ) : (
          'Plan my week ✨'
        )}
      </button>
    </form>
  );
}