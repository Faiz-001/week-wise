// Returns { plan, fallback }. Throws an Error with a readable message on failure.
export async function generatePlan(input) {
  const res = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.details?.join(', ') || data.error || 'Something went wrong');
  }
  return data;
}
