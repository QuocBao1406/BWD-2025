import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Xác định __dirname (vì dùng ES Module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình thư mục lưu ảnh và đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // lấy đuôi file (jpg/png/...)
    const filename = `${Date.now()}${ext}`; // tên file: thời gian + đuôi
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Route POST /api/upload/image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Trả về đường dẫn ảnh để frontend lưu vào bài viết
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

export default router;