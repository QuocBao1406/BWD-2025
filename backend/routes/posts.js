const express = require('express');
const router = express.Router();
const db = require('../db'); // Kết nối mysql2

// POST /api/posts - Thêm bài viết mới
router.post('/', async (req, res) => {
  const { content, images, authorId, author, authorAvatar } = req.body;

  try {
    const imagesJson = JSON.stringify(images || []);
    const [result] = await db.query(
      `INSERT INTO posts (content, images, author_id, author_name, author_avatar, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [content, imagesJson, authorId, author, authorAvatar]
    );

    res.status(201).json({ message: 'Post created successfully.', id: result.insertId });
  } catch (err) {
    console.error('❌ Lỗi khi tạo bài viết:', err);
    res.status(500).json({ message: 'Error creating post.' });
  }
});

// GET /api/posts - Lấy danh sách tất cả bài viết
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách bài viết:', err);
    res.status(500).json({ message: 'Error retrieving posts.' });
  }
});

// GET /api/posts/:id - Lấy chi tiết 1 bài viết
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Lỗi khi lấy bài viết theo ID:', err);
    res.status(500).json({ message: 'Error retrieving post' });
  }
});

module.exports = router;