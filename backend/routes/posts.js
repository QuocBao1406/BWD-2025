import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET /api/posts - Lấy tất cả bài viết kèm danh sách user đã like (likedBy)
router.get('/', async (req, res) => {
  try {
    const [posts] = await query('SELECT * FROM posts ORDER BY created_at DESC');
    const [likes] = await query('SELECT post_id, user_id FROM post_likes');

    const likeMap = {};
    likes.forEach(({ post_id, user_id }) => {
      if (!likeMap[post_id]) likeMap[post_id] = [];
      likeMap[post_id].push(user_id);
    });

    const postsWithLikes = posts.map(post => ({
      ...post,
      likedBy: likeMap[post.id] || [],
    }));

    res.json(postsWithLikes);
  } catch (err) {
    console.error('❌ Lỗi lấy bài viết:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/posts - Tạo bài viết mới
router.post('/', async (req, res) => {
  const { content, images, author, authorId, authorAvatar } = req.body;

  if (!content || !author || !authorId) {
    return res.status(400).json({ success: false, message: 'Thiếu dữ liệu bài viết' });
  }

  try {
    const [result] = await query(
      'INSERT INTO posts (content, images, author_name, author_id, author_avatar) VALUES (?, ?, ?, ?, ?)',
      [content, JSON.stringify(images || []), author, authorId, authorAvatar]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('❌ Lỗi lưu bài viết:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu bài viết' });
  }
});

// POST /api/posts/:id/like - Toggle like/unlike bài viết
router.post('/:id/like', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Thiếu userId' });
  }

  try {
    const [likedRows] = await query(
      'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?',
      [id, userId]
    );

    if (likedRows.length === 0) {
      await query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [id, userId]);
      await query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id]);
      res.json({ success: true, liked: true });
    } else {
      await query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [id, userId]);
      await query('UPDATE posts SET likes = likes - 1 WHERE id = ?', [id]);
      res.json({ success: true, liked: false });
    }
  } catch (err) {
    console.error('❌ Lỗi cập nhật like:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST /api/posts/:id/comment - Thêm bình luận
router.post('/:id/comment', async (req, res) => {
  const { id } = req.params;
  const newComment = req.body;

  if (!newComment || !newComment.content) {
    return res.status(400).json({ success: false, message: 'Nội dung bình luận không hợp lệ' });
  }

  try {
    const [rows] = await query('SELECT comments FROM posts WHERE id = ?', [id]);
    let comments = [];

    if (rows[0]?.comments) {
      try {
        comments = JSON.parse(rows[0].comments);
      } catch (err) {
        console.warn('⚠️ Bình luận cũ không phải JSON:', err);
      }
    }

    const fullComment = {
      ...newComment,
      createdAt: new Date().toISOString(),
    };

    comments.push(fullComment);

    await query('UPDATE posts SET comments = ? WHERE id = ?', [JSON.stringify(comments), id]);
    res.json({ success: true, comment: fullComment });
  } catch (err) {
    console.error('❌ Lỗi khi thêm bình luận:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

export default router;