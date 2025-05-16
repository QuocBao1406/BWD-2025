import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// ✅ PUT /api/profile/update
router.put('/update', async (req, res) => {
  const { email, name, provider, aboutme } = req.body;

  try {
    await query('UPDATE users SET name = ?, email = ?, auth_provider = ? WHERE email = ?', [
      name, email, provider, email,
    ]);

    await query('UPDATE user_profiles SET about_me = ? WHERE user_id = (SELECT id FROM users WHERE email = ?)', [
      aboutme, email,
    ]);

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật hồ sơ.' });
  }
});

// ✅ POST /api/profile/avatar
router.post('/avatar', async (req, res) => {
  const { userId, avatar } = req.body;
  if (!userId || !avatar) return res.status(400).json({ message: 'Thiếu userId hoặc avatar' });

  try {
    const buffer = Buffer.from(avatar, 'base64');
    await query('UPDATE users SET avatar = ? WHERE id = ?', [buffer, userId]);
    res.json({ success: true, message: 'Avatar updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật avatar' });
  }
});

// ✅ GET /api/profile/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await query(
      'SELECT id, name, username, email, auth_provider, TO_BASE64(avatar) as avatar FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const user = rows[0];

    if (!user.name) {
      const [nameRows] = await query(`
        SELECT name FROM users 
        WHERE name LIKE 'User%' AND name REGEXP '^User[0-9]+$'
        ORDER BY CAST(SUBSTRING(name, 5) AS UNSIGNED) DESC
        LIMIT 1
      `);

      let nextNumber = 1;
      if (nameRows.length > 0) {
        const lastNumber = parseInt(nameRows[0].name.replace('User', ''), 10);
        nextNumber = lastNumber + 1;
      }

      const generatedName = `User${nextNumber}`;
      await query('UPDATE users SET name = ? WHERE id = ?', [generatedName, user.id]);
      user.name = generatedName;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi lấy profile' });
  }
});

export default router;