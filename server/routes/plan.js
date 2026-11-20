import { Router } from 'express';
import { inputSchema, planSchema } from '../schema.js';
import { buildPrompt } from '../prompt.js';
import { generateJson } from '../llm.js';
import { samplePlan } from '../samplePlan.js';

const router = Router();
const MAX_ATTEMPTS = 2;

router.post('/plan', async (req, res) => {
  const parsed = inputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid input',
      details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }

  const prompt = buildPrompt(parsed.data);
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const raw = await generateJson(prompt);
      const plan = planSchema.parse(raw);
      return res.json({ plan, fallback: false });
    } catch (err) {
      lastError = err;
      console.error(`Plan attempt ${attempt} failed:`, err.message);
    }
  }

  // Never leave the user (or the demo) with an error screen.
  console.error('Serving fallback plan after errors:', lastError?.message);
  res.json({ plan: samplePlan, fallback: true });
});

export default router;
