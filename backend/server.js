import express, { json } from 'express';
import cors from 'cors';
const app = express();
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import initDB from './initDB.js';

app.use(cors());
app.use(json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});