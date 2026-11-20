import { z } from 'zod';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const timeStr = z.string().regex(/^\d{1,2}:\d{2}$/, 'Use HH:MM');

// ---------- Request body ----------
export const inputSchema = z.object({
  // e.g. { Mon: [{ start: "09:00", end: "17:00" }], Tue: [] }
  busy: z
    .record(
      z.enum(DAYS),
      z.array(z.object({ start: timeStr, end: timeStr }))
    )
    .default({}),
  diet: z.string().max(200).default('No restrictions'),
  allergies: z.string().max(200).default('None'),
  budget: z.number().positive().max(100000),
  householdSize: z.number().int().min(1).max(12).default(1),
  chores: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        minutes: z.number().int().min(5).max(240),
      })
    )
    .max(15)
    .default([]),
});

// ---------- Plan returned by the LLM ----------
const meal = z.object({
  name: z.string(),
  prepMinutes: z.number().int().min(0),
});

export const planSchema = z.object({
  days: z
    .array(
      z.object({
        day: z.enum(DAYS),
        meals: z.object({ breakfast: meal, lunch: meal, dinner: meal }),
        chores: z.array(
          z.object({
            name: z.string(),
            start: timeStr,
            end: timeStr,
          })
        ),
      })
    )
    .length(7),
  groceries: z.array(
    z.object({
      aisle: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.string(),
          estCost: z.number().min(0),
        })
      ),
    })
  ),
  estimatedTotal: z.number().min(0),
  timeSavedMinutes: z.number().int().min(0),
  tip: z.string().default(''),
});
