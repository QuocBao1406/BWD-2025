import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js'; // ✅ thêm dòng này
import initDB from './initDB.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

app.use(json({ limit: '10mb' })); // ✅ tăng giới hạn payload nếu cần

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount các routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes); // ✅ mount upload ảnh

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});