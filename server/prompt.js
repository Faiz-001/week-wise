import { DAYS } from './schema.js';

const OUTPUT_SHAPE = `{
  "days": [
    {
      "day": "Mon",
      "meals": {
        "breakfast": { "name": "string", "prepMinutes": 10 },
        "lunch": { "name": "string", "prepMinutes": 15 },
        "dinner": { "name": "string", "prepMinutes": 30 }
      },
      "chores": [ { "name": "string", "start": "18:00", "end": "18:30" } ]
    }
  ],
  "groceries": [
    { "aisle": "Produce", "items": [ { "name": "string", "quantity": "2 lb", "estCost": 3.5 } ] }
  ],
  "estimatedTotal": 0,
  "timeSavedMinutes": 0,
  "tip": "string"
}`;

function formatBusy(busy) {
  return DAYS.map((d) => {
    const blocks = busy[d] ?? [];
    return `${d}: ${
      blocks.length
        ? blocks.map((b) => `${b.start}-${b.end}`).join(', ')
        : 'free all day'
    }`;
  }).join('\n');
}

export function buildPrompt(input) {
  const chores = input.chores.length
    ? input.chores.map((c) => `- ${c.name} (${c.minutes} min)`).join('\n')
    : '- none';

  return `You are an efficiency-focused household planner. Build ONE complete week plan.

USER CONSTRAINTS
Household size: ${input.householdSize}
Diet: ${input.diet}
Allergies (never include): ${input.allergies}
Weekly grocery budget: ${input.budget}

BUSY BLOCKS (do not schedule chores inside these)
${formatBusy(input.busy)}

CHORES TO SCHEDULE (each at least once this week, spread sensibly)
${chores}

RULES
- Output exactly 7 days in this order: ${DAYS.join(', ')}.
- Prefer meals that reuse ingredients across the week to cut cost and waste.
- Keep weekday prep times short; save longer cooking for free days.
- Schedule chores only in free time, using 24h HH:MM, with end = start + chore minutes.
- Merge all ingredients into ONE grocery list grouped by aisle, deduplicated, with realistic quantities for the household size.
- estimatedTotal must equal the sum of all item estCost and should stay within the budget.
- timeSavedMinutes is a realistic estimate of weekly planning/shopping time saved versus doing this manually.
- tip is one short, practical sentence.

Respond with ONLY valid JSON matching this shape (no markdown, no commentary):
${OUTPUT_SHAPE}`;
}
