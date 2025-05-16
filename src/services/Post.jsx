import React, { useState } from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaRegCommentAlt, FaUserCircle } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Post = ({ post, setPosts, currentUser }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  // So sánh ID kiểu số để đảm bảo đúng
  const hasLiked = currentUser && post.likedBy?.some(id => Number(id) === Number(currentUser.id));

  const postUrl = `${window.location.origin}/post/${post.id}`;

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Lỗi khi like bài viết');
        return;
      }

      const liked = data.liked;

      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === post.id) {
            return {
              ...p,
              likes: liked ? p.likes + 1 : p.likes - 1,
              likedBy: liked
                ? [...(p.likedBy || []), currentUser.id]
                : (p.likedBy || []).filter(u => Number(u) !== Number(currentUser.id)),
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Lỗi khi like:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    const newComment = {
      id: Date.now(),
      content: comment,
      author: currentUser.name,
      authorUsername: currentUser.username,
      authorId: currentUser.id,
      authorAvatar: currentUser.avatar,
    };

    const res = await fetch(`http://localhost:5000/api/posts/${post.id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (!data.success) {
        alert(data.message || 'Lỗi khi gửi bình luận');
        return;
      }
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === post.id ? { ...p, comments: [...(p.comments || []), data.comment] } : p
        )
      );
      setComment('');
    } catch (err) {
      console.error('Response không phải JSON:', text);
      alert('Lỗi phản hồi từ server, vui lòng thử lại.');
    };
  };

  const handleShare = (type) => {
    if (type === 'copy') {
      navigator.clipboard?.writeText(postUrl)
        .then(() => alert('Đã copy link bài viết!'))
        .catch(() => alert('Không thể copy link'));
    }
    setShowSharePopup(false);
  };

  const handleFacebookShare = () => {
    const caption = `${post.content}\n\n📎 Xem bài viết tại: ${postUrl}`;
    navigator.clipboard.writeText(caption).then(() => {
      alert('Mở Facebook!');
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
      window.open(fbUrl, '_blank', 'width=600,height=500');
    });
  };

  return (
    <div className='post'>
      <div className='post-header'>
        <div className="author-info">
          <Link to={`/profile/${post.authorId}`} className="post-avatar">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={`${post.author}'s avatar`} className="avatar-image" />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
          </Link>
          <div className="author-details">
            <Link to={`/profile/${post.authorId}`} className="post-author">{post.author}</Link>
            <small className='post-time'>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        </div>
      </div>

      <div className='post-content'>
        <p>{post.content}</p>
        {post.images?.length > 0 && (
          <div className='post-images'>
            {post.images.map((img, index) => (
              <img
                key={index}
                src={img.startsWith('/uploads')
                  ? `http://localhost:5000${img}`
                  : `data:image/png;base64,${img}`}
                alt={`post-${post.id}-${index}`}
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}
        <div className='post-meta'>
          <span>{post.likes || 0} Lượt thích</span>
          {post.comments?.length > 0 && <span>{post.comments.length} Bình luận</span>}
        </div>
      </div>

      <div className='post-actions'>
        <button
          className={`like-btn ${hasLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={!currentUser}
        >
          {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span>Thích</span>
        </button>

        <button
          className="comment-btn"
          onClick={() => setShowComments(prev => !prev)}
          disabled={!currentUser}
        >
          <FaRegCommentAlt />
          <span>Bình luận</span>
        </button>

        <button className="share-btn" onClick={() => setShowSharePopup(true)}>
          <FiShare />
          <span>Chia sẻ</span>
        </button>
      </div>

      {showSharePopup && (
        <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
          <div className="share-popup" onClick={e => e.stopPropagation()}>
            <div className="share-popup-header">
              <h4>Chia sẻ bài viết</h4>
              <button className="close-share-popup" onClick={() => setShowSharePopup(false)}>&times;</button>
            </div>
            <div className="share-popup-body">
              <button className="share-option" onClick={handleFacebookShare}>📘 Chia sẻ lên Facebook</button>
              <button className="share-option" onClick={() => handleShare('copy')}>🔗 Copy link bài viết</button>
            </div>
          </div>
        </div>
      )}

      {showComments && (
        <div className='post-comments'>
          {post.comments?.map(comment => (
            <div key={comment.id} className='comment'>
              <div className="comment-author-info">
                <Link to={`/profile/${comment.authorId}`} className="comment-avatar">
                  {comment.authorAvatar ? (
                    <img src={comment.authorAvatar} alt="" className="avatar-image" />
                  ) : (
                    <FaUserCircle className="default-avatar small" />
                  )}
                </Link>
                <div className="comment-content-wrapper">
                  <div className='comment-header'>
                    <Link to={`/profile/${comment.authorId}`} className='comment-author'>
                      {comment.author}
                    </Link>
                    <small className='comment-time'>
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className='comment-body'>
                    <span className='comment-content'>{comment.content}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {currentUser && (
            <form onSubmit={handleAddComment} className='comment-form'>
              <div className="current-user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="" className="avatar-image" />
                ) : (
                  <FaUserCircle className="default-avatar small" />
                )}
              </div>
              <input
                className='comment-input'
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Viết bình luận...'
              />
              <button type='submit'>Gửi</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;