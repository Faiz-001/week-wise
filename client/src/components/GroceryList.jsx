import { useState } from 'react';

const ICONS = [
  [/produce|veg|fruit/i, '🥬'],
  [/meat|fish|seafood|poultry/i, '🍗'],
  [/dairy|egg/i, '🧀'],
  [/bak|bread/i, '🍞'],
  [/frozen/i, '🧊'],
  [/pantry|grain|dry|can/i, '🥫'],
  [/drink|bever/i, '🥤'],
  [/spice|season|sauce|condiment/i, '🧂'],
];
const iconFor = (aisle) => ICONS.find(([re]) => re.test(aisle))?.[1] ?? '🛒';

export default function GroceryList({ groceries, total, budget }) {
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);

  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  const itemCount = groceries.reduce((n, g) => n + g.items.length, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = itemCount ? (doneCount / itemCount) * 100 : 0;

  async function copy() {
    const text = groceries
      .map((g) => `${g.aisle}\n${g.items.map((i) => `- ${i.name} (${i.quantity})`).join('\n')}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  const over = budget && total > budget;
  const pct = budget ? Math.min((total / budget) * 100, 100) : 0;

  return (
    <section className="reveal rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-stone-200/70" style={{ animationDelay: '300ms' }}>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Grocery list</h2>
        <button onClick={copy} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 print:hidden ${copied ? 'pop bg-leaf-600 text-white' : 'bg-leaf-50 text-leaf-700 hover:bg-leaf-100'}`}>
          {copied ? 'Copied ✓' : 'Copy list'}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-3 text-xs text-stone-500">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full rounded-full bg-leaf-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="tabular-nums">{doneCount}/{itemCount} in cart</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {groceries.map((g) => (
          <div key={g.aisle}>
            <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-500">
              <span className="text-base" aria-hidden>{iconFor(g.aisle)}</span>
              {g.aisle}
            </h3>
            <ul className="space-y-0.5 text-sm">
              {g.items.map((item, i) => {
                const key = `${g.aisle}-${i}`;
                const on = !!checked[key];
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-leaf-50">
                      <input type="checkbox" checked={on} onChange={() => toggle(key)} className="h-4 w-4 shrink-0 accent-leaf-600" />
                      <span className={`flex-1 transition ${on ? 'text-stone-400 line-through' : ''}`}>
                        {item.name} <span className="text-stone-400">({item.quantity})</span>
                      </span>
                      <span className="text-xs tabular-nums text-stone-400">${item.estCost.toFixed(2)}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-stone-100 pt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-semibold">Estimated total</span>
          <span className={`font-display text-lg font-semibold ${over ? 'text-clay-500' : 'text-leaf-700'}`}>
            ${total.toFixed(2)}
            {budget ? <span className="text-sm font-normal text-stone-400"> / ${budget}</span> : null}
          </span>
        </div>
        {budget ? (
          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div className={`h-full rounded-full transition-all duration-700 ${over ? 'bg-clay-500' : 'bg-linear-to-r from-leaf-400 to-leaf-600'}`} style={{ width: `${pct}%` }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}