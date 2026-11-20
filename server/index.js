import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import planRouter from './routes/plan.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', planRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
