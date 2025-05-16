import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from '../components/loginPage';
import Navbar from '../components/navbar';
import Home from '../pages/Home';
import Travel from '../pages/Travel';
import Products from '../pages/Products';
import News from '../pages/News';
import About from '../pages/About';
import Message from '../components/Message';
import OAuthSuccess from '../pages/OAuthSuccess';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import i18n from '../i18n';
import PostDetail from '../components/PostDetail';

function BodyClassManager() {
  const location = useLocation();

  useEffect(() => {
    // Tạo class theo pathname, ví dụ: "/login" => "page-login"
    const page = location.pathname === '/' ? 'home' : location.pathname.slice(1).replace(/\//g, '-');
    const pageClass = `page-${page}`;

    // Reset body class rồi thêm class mới
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(pageClass);
  }, [location]);

  return null; // Component này không render gì, chỉ để quản lý class
}

function App() {
    useEffect(() => {
    const lang = i18n.language || 'en';
    document.body.classList.remove('lang-en', 'lang-vi'); // Xóa cũ
    document.body.classList.add(`lang-${i18n.language}`); // Thêm mới
  }, [i18n.language]);

  return (
    <Router>
      <BodyClassManager />
      <Navbar />
      <div style={{ paddingTop: '70px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/products" element={<Products />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/message" element={<Message />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;