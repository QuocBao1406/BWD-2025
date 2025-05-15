import { Router } from 'express';
const router = Router();
import { hash, compare } from 'bcrypt';
import { query } from '../db.js';
import axios from 'axios';

// Đăng ký
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Oops! You missed something!' });
  }

  try {
    const [exist] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (exist.length > 0) {
      return res.status(409).json({ message: 'Email already exises!' });
    }

    const [check] = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (check.length > 0) {
      return res.status(409).json({ message: 'Username already exises!' });
    }

    const hashedPassword = await hash(password, 10);

    await query(
      'INSERT INTO users (username, email, password, auth_provider) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'local']
    );

    res.json({ message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'SERVER ERROR WHEN REGISTER!' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'NO EXISTING THAT ACCOUNT!' });
    }

    const user = rows[0];
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'WRONG PASSWORD!' });
    }

    res.json({
      message: 'LOGIN SUCESSFUL!',
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar ? `data:image/jpeg;base64,${Buffer.from(user.avatar).toString('base64')}` : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'SERVER ERROR WHEN LOGIN!' });
  }
});

// Google OAuth
const GOOGLE_CLIENT_ID = '56923204359-bvfrbnjevbgf50ua855dma9h4gc93gjn.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:5000/api/auth/google/callback';

router.get('/auth/google', (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(redirectUrl);
});

router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, picture } = userInfo.data;

    const [existing] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      // Chưa có user, thêm mới
      await query(
        'INSERT INTO users (name, email, password, auth_provider) VALUES (?, ?, ?, ?)',
        [name, email, null, 'google']
      );
    } else {
      // Đã có user, kiểm tra provider
      const user = existing[0];
      if (!user.auth_provider.includes('google')) {
        const providers = new Set(user.auth_provider.split(',').filter(Boolean));
        providers.add('google');
        const updatedProvider = Array.from(providers).join(',');

        await query('UPDATE users SET auth_provider = ? WHERE email = ?', [updatedProvider, email]);
      }
    }

    // Gửi dữ liệu về frontend qua URL query
    res.redirect(`http://localhost:3000/oauth-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&avatar=${encodeURIComponent(picture)}&provider=Google`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Google OAuth Error');
  }
});

// Discord OAuth
const DISCORD_CLIENT_ID = '1370100195274133664';
const DISCORD_CLIENT_SECRET = 'KRDex32jakr0anszGo4ol0Dz_ao6DnI6';
const DISCORD_REDIRECT_URI = 'http://localhost:5000/api/auth/discord/callback';

router.get('/auth/discord', (req, res) => {
  const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`;
  res.redirect(redirectUrl);
});

router.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Lấy access token
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
      scope: 'identify email'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenRes.data.access_token;

    // Lấy thông tin người dùng
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { username, email, avatar } = userRes.data;

    if (!email) return res.status(400).send('Discord email not available');

    // Kiểm tra email có tồn tại chưa
    const [existing] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      await query(
        'INSERT INTO users (name, email, password, auth_provider) VALUES (?, ?, ?, ?)',
        [username, email, null, 'discord']
      );
    } else {
      const user = existing[0];
      if (!user.auth_provider.includes('discord')) {
        const providers = new Set(user.auth_provider.split(',').filter(Boolean));
        providers.add('discord');
        const updatedProvider = Array.from(providers).join(',');
        await query('UPDATE users SET auth_provider = ? WHERE email = ?', [updatedProvider, email]);
      }
    }

    const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${userRes.data.id}/${avatar}.png` : '';

    res.redirect(`http://localhost:3000/oauth-success?name=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&avatar=${encodeURIComponent(avatarUrl)}&provider=Discord`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Discord OAuth Error');
  }
});

// GitHub OAuth config
const GITHUB_CLIENT_ID = 'Ov23li8asT9OKkV68Uqm';
const GITHUB_CLIENT_SECRET = '30a18a87ba84f6bbe79506abc612555a4e751068';
const GITHUB_REDIRECT_URI = 'http://localhost:5000/api/auth/github/callback';

// B1: Redirect người dùng đến GitHub login
router.get('/auth/github', (req, res) => {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user`;
  res.redirect(githubUrl);
});

// B2: GitHub callback
router.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Lấy access token từ GitHub
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI,
    }, {
      headers: { Accept: 'application/json' }
    });

    const access_token = tokenRes.data.access_token;

    // Lấy thông tin user
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { login, avatar_url, email, name } = userRes.data;

    // Nếu không có email, lấy thêm
    let userEmail = email;
    if (!userEmail) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const primaryEmail = emailsRes.data.find(e => e.primary && e.verified);
      userEmail = primaryEmail?.email;
    }

    if (!userEmail) return res.status(400).send("Cannot get email from GitHub");

    const [existing] = await query('SELECT * FROM users WHERE email = ?', [userEmail]);
    if (existing.length === 0) {
      // Email chưa tồn tại -> tạo user mới
      await query(
        'INSERT INTO users (name, email, password, auth_provider) VALUES (?, ?, ?, ?)',
        [name || login, userEmail, null, 'github']
      );
    } else {
      // Đã tồn tại user với email này (có thể từ Google / local)
      const user = existing[0];

      // Nếu provider trước đó khác, cập nhật nếu cần
      if (!user.auth_provider.includes('github')) {
        // Ghép chuỗi các provider cũ với 'github' mà không bị trùng
        const providers = new Set(user.auth_provider.split(',').filter(Boolean));
        providers.add('github');
        const updatedProvider = Array.from(providers).join(',');

        await query('UPDATE users SET auth_provider = ? WHERE email = ?', [updatedProvider, userEmail]);
      }
    }

    res.redirect(`http://localhost:3000/oauth-success?name=${encodeURIComponent(name || login)}&email=${encodeURIComponent(userEmail)}&avatar=${encodeURIComponent(avatar_url)}&provider=Github`);
  } catch (err) {
    console.error(err);
    res.status(500).send('GitHub OAuth Error');
  }
});

// Facebook OAuth
const FACEBOOK_CLIENT_ID = '1050396430472400';
const FACEBOOK_CLIENT_SECRET = 'cdb40cf65c49d7b52facc8eebdb55a2c';
const FACEBOOK_REDIRECT_URI = 'http://localhost:5000/api/auth/facebook/callback';

router.get('/auth/facebook', (req, res) => {
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email,public_profile`;
  res.redirect(url);
});

router.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: FACEBOOK_REDIRECT_URI,
        code
      }
    });

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token
      }
    });

    const { name, email, picture } = userRes.data;

    if (!email) return res.status(400).send('Facebook email not available');

    const [existing] = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      await query('INSERT INTO users (name, email, password, auth_provider) VALUES (?, ?, ?, ?)', [name, email, null, 'facebook']);
    } else {
      const user = existing[0];
      if (!user.auth_provider.includes('facebook')) {
        const providers = new Set(user.auth_provider.split(',').filter(Boolean));
        providers.add('facebook');
        const updatedProvider = Array.from(providers).join(',');
        await query('UPDATE users SET auth_provider = ? WHERE email = ?', [updatedProvider, email]);
      }
    }

    res.redirect(`http://localhost:3000/oauth-success?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&avatar=${encodeURIComponent(picture?.data?.url)}&provider=Facebook`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Facebook OAuth Error');
  }
});

export default router;