import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js';
import initDB from './initDB.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());

// Tăng giới hạn body JSON lên 10MB để tránh lỗi payload quá lớn
app.use(express.json({ limit: '10mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve ảnh tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount các routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Khởi tạo database nếu cần
initDB();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});