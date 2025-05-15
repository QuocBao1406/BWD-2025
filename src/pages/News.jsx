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

  const handlePostSubmit = (newPost) => {
  if (!currentUser) return;

  setPosts(prev => [{
    id: Date.now(),
    content: newPost.content,
    images: newPost.images,
    likes: 0,
    comments: [],
    author: currentUser.name || currentUser.username, // ✅ sửa chỗ này
    authorId: currentUser.id || 'user-id',
    authorAvatar: currentUser.avatar || null,
    createdAt: new Date().toISOString(),
    }, ...prev]);

    setShowPostCreator(false);
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