import { useEffect, useState } from 'react';
import PlanForm from './components/PlanForm.jsx';
import WeekGrid from './components/WeekGrid.jsx';
import GroceryList from './components/GroceryList.jsx';
import { generatePlan } from './lib/api.js';

const STORAGE_KEY = 'weekwise:v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const step = (t) => {
      start ??= t;
      const p = Math.min((t - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// Easter egg for the judges' secret criterion.
function Capybara() {
  return (
    <svg viewBox="0 0 64 40" className="bob inline h-6 w-10 align-middle opacity-80" role="img" aria-label="A capybara, chilling">
      <title>Capybara found!</title>
      <ellipse cx="30" cy="24" rx="22" ry="12" fill="#a97c50" />
      <rect x="44" y="12" width="16" height="14" rx="7" fill="#8f6640" />
      <ellipse cx="59" cy="20" rx="3" ry="2.5" fill="#3b2a1a" />
      <circle cx="52" cy="16" r="1.4" fill="#1c1209" />
      <circle cx="46" cy="11" r="2.4" fill="#8f6640" />
      <rect x="14" y="32" width="5" height="6" rx="2" fill="#8f6640" />
      <rect x="38" y="32" width="5" height="6" rx="2" fill="#8f6640" />
    </svg>
  );
}

const LOADING_LINES = [
  'Chopping the onions…',
  'Balancing your budget…',
  'Finding gaps in your week…',
  'Merging the grocery list…',
  'Plating up your plan…',
];

function Loading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % LOADING_LINES.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-5">
      <p className="text-center font-display text-lg text-leaf-700">{LOADING_LINES[i]}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((n) => <div key={n} className="skeleton h-20 rounded-2xl" />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((n) => <div key={n} className="skeleton h-44 rounded-2xl" />)}
      </div>
    </div>
  );
}

function Stat({ label, value, prefix = '', suffix = '', accent, delay = 0 }) {
  const shown = useCountUp(value);
  return (
    <div
      className={`reveal rounded-2xl p-4 text-center shadow-sm ${accent ? 'bg-linear-to-br from-leaf-600 to-leaf-700 text-white shadow-leaf-600/30' : 'bg-white/90 ring-1 ring-stone-200/70'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-display text-2xl font-extrabold tabular-nums">{prefix}{shown}{suffix}</div>
      <div className={`mt-0.5 text-xs font-semibold uppercase tracking-wide ${accent ? 'text-leaf-100' : 'text-stone-500'}`}>{label}</div>
    </div>
  );
}

export default function App() {
  const saved = load();
  const [plan, setPlan] = useState(saved.plan ?? null);
  const [fallback, setFallback] = useState(saved.fallback ?? false);
  const [budget, setBudget] = useState(saved.budget ?? null);
  const [planId, setPlanId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(payload, formState) {
    setLoading(true);
    setError('');
    try {
      const { plan, fallback } = await generatePlan(payload);
      setPlan(plan);
      setFallback(fallback);
      setBudget(payload.budget);
      setPlanId((n) => n + 1); // re-triggers entrance animations
      save({ plan, fallback, budget: payload.budget, form: formState });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const choreCount = plan?.days.reduce((n, d) => n + d.chores.length, 0) ?? 0;
  const mealCount = plan ? plan.days.length * 3 : 0;

  return (
    <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:px-6 lg:h-screen lg:overflow-hidden print:h-auto print:overflow-visible">
      {/* Hero */}
      <header className="reveal relative mb-4 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-leaf-700 via-leaf-600 to-leaf-500 px-5 py-3.5 text-white shadow-lg shadow-leaf-700/20 sm:px-8 print:hidden">
        <div className="pointer-events-none absolute -right-2 -top-3 select-none text-5xl opacity-20 float-slow" aria-hidden>🥕</div>
        <div className="pointer-events-none absolute -bottom-2 right-24 select-none text-4xl opacity-20 float-slow" style={{ animationDelay: '1.5s' }} aria-hidden>🧺</div>
        <div className="relative flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">WeekWise</h1>
            <span className="hidden rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur md:inline">A MORE EFFICIENT WAY TO LIVE</span>
          </div>
          <p className="max-w-md text-sm text-leaf-50/90 sm:pr-16 sm:text-right">Tell us your week once. Get meals, a grocery list and chores in about a minute.</p>
        </div>
      </header>

      <div className="grid gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[400px_1fr] print:block">
        <aside className="print:hidden lg:min-h-0 lg:overflow-y-auto lg:p-1 lg:pb-6 lg:pr-2">
          <div className="reveal rounded-3xl bg-white/90 p-6 shadow-lg shadow-stone-900/5 ring-1 ring-stone-200/70" style={{ animationDelay: '120ms' }}>
            <PlanForm onSubmit={handleSubmit} loading={loading} initial={saved.form} />
          </div>
          {error && (
            <p role="alert" className="reveal mt-3 rounded-xl bg-clay-100 px-4 py-3 text-sm font-medium text-clay-500">
              {error}
            </p>
          )}
        </aside>

        <main className="min-w-0 space-y-6 lg:min-h-0 lg:overflow-y-auto lg:p-1 lg:pb-6 lg:pr-2 print:overflow-visible" aria-live="polite">
          {loading && <Loading />}

          {!loading && !plan && (
            <div className="reveal grid place-items-center rounded-3xl border-2 border-dashed border-leaf-200 bg-white/50 px-6 py-20 text-center">
              <div className="float-slow text-6xl" aria-hidden>🗓️</div>
              <h2 className="mt-4 font-display text-2xl font-semibold">Your week, sorted</h2>
              <p className="mt-1 max-w-sm text-stone-500">Fill in the form and hit <strong>Plan my week</strong>. Your plan will appear here.</p>
            </div>
          )}

          {!loading && plan && (
            <div key={planId} className="space-y-6">
              {fallback && (
                <p className="reveal rounded-xl bg-sun-100 px-4 py-3 text-sm font-medium text-amber-900">
                  Showing a sample plan because the AI service was unavailable. Try again in a moment.
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Time saved" value={plan.timeSavedMinutes} prefix="~" suffix=" min" accent />
                <Stat label="Est. groceries" value={Math.round(plan.estimatedTotal)} prefix="$" delay={80} />
                <Stat label="Meals planned" value={mealCount} delay={160} />
                <Stat label="Chores scheduled" value={choreCount} delay={240} />
              </div>

              {plan.tip && (
                <p className="reveal rounded-2xl bg-leaf-50 px-5 py-4 text-sm text-leaf-900 ring-1 ring-leaf-100" style={{ animationDelay: '300ms' }}>
                  <span className="mr-1.5" aria-hidden>💡</span>{plan.tip}
                </p>
              )}

              <WeekGrid days={plan.days} />
              <GroceryList groceries={plan.groceries} total={plan.estimatedTotal} budget={budget} />

              <div className="print:hidden">
                <button onClick={() => window.print()} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:ring-leaf-400 active:scale-95">
                  🖨️ Print plan
                </button>
              </div>
            </div>
          )}
          <footer className="pt-6 text-center text-xs text-stone-400 print:hidden">
            Built for the Triple H Hackathon <Capybara />
          </footer>
        </main>
      </div>

    </div>
  );
}