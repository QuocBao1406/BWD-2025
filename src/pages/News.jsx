import React, { useState, useEffect, useContext } from 'react';
import Post from '../services/Post';
import PostCreator from '../services/PostForm';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/news.scss';
import { UserContext } from '../contexts/UserContext';

function News() {
  const [posts, setPosts] = useState([]);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        const loadedPosts = data.map(post => ({
          ...post,
          images: JSON.parse(post.images), // chuyển chuỗi JSON sang mảng
          createdAt: new Date(post.created_at).toLocaleString(), // định dạng thời gian
          author: post.author_name,
          authorAvatar: post.author_avatar
        }));
        setPosts(loadedPosts);
      })
      .catch(err => console.error('Lỗi tải bài viết:', err));
  }, []);

  const handlePostSubmit = async (newPost) => {
  if (!currentUser) return;

  const postToSave = {
    content: newPost.content,
    images: newPost.images, // mảng base64 thuần
    author: currentUser.name || currentUser.username,
    authorId: currentUser.id,
    authorAvatar: currentUser.avatar,
  };

  try {
    const res = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postToSave)
    });

    if (!res.ok) throw new Error('Lỗi khi lưu bài viết');

    const data = await res.json(); // Lấy id từ backend

    const localPost = {
      ...postToSave,
      id: data.id, // ✅ ID từ DB để dùng chia sẻ
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [localPost, ...prev]);
    setShowPostCreator(false);
  } catch (err) {
    alert('Không thể đăng bài. Lỗi server.');
    console.error(err);
  }
};

  const openPostCreator = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đăng bài');
      return;
    }
    setShowPostCreator(true);
  };

  return (
    <div className='news-container'>
      <div className='news-feed'>
        {currentUser && (
          <div className='create-post-box' onClick={openPostCreator}>
            <div className='user-avatar'>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt='avatar' />
              ) : (
                <FaUserCircle className='default-avatar' />
              )}
            </div>
            <div className='create-post-input'>
              <span>{currentUser.name} ơi, bạn đang nghĩ gì thế?</span>
            </div>
          </div>
        )}

        {showPostCreator && (
          <div className='modal-overlay' onClick={() => setShowPostCreator(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <PostCreator
                onPostSubmit={handlePostSubmit}
                onClose={() => setShowPostCreator(false)}
              />
            </div>
          </div>
        )}

        <div className='post-list'>
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              setPosts={setPosts}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;