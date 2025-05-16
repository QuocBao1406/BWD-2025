import React, { useState } from 'react';
import { FaThumbsUp, FaRegThumbsUp, FaRegCommentAlt, FaUserCircle } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Post = ({ post, setPosts, currentUser }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.username);
  const postUrl = `${window.location.origin}/post/${post.id}`;

  const handleLike = () => {
    if (!currentUser) return;

    setPosts(prevPosts =>
      prevPosts.map(p => {
        if (p.id === post.id) {
          const liked = p.likedBy?.includes(currentUser.username);
          return {
            ...p,
            likes: liked ? p.likes - 1 : p.likes + 1,
            likedBy: liked
              ? p.likedBy.filter(user => user !== currentUser.username)
              : [...(p.likedBy || []), currentUser.username]
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    const newComment = {
      id: Date.now(),
      content: comment,
      author: currentUser.name,
      authorUsername: currentUser.username,
      authorId: currentUser.id,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString()
    };

    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );
    setComment('');
  };

  const handleShare = (type) => {
    if (type === 'copy') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(postUrl);
        alert('Đã copy link bài viết!');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = postUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Đã copy link bài viết!');
      }
    }
    setShowSharePopup(false);
  };

  const handleFacebookShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const caption = `${post.content}\n\n📎 Xem bài viết tại: ${postUrl}`;

    // Copy caption
    navigator.clipboard.writeText(caption).then(() => {
      alert('Mở Facebook!');

      // Mở share Facebook
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
              <img
                src={post.authorAvatar}
                alt={`${post.author}'s avatar`}
                className="avatar-image"
              />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
          </Link>
          <div className="author-details">
            <Link to={`/profile/${post.authorId}`} className="post-author">
              {post.author}
            </Link>
            <small className='post-time'>
              {new Date(post.createdAt).toLocaleString()}
            </small>
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
                src={
                  img.startsWith('/uploads')
                    ? `http://localhost:5000${img}`
                    : `data:image/png;base64,${img}`
                }
                alt={`post-${post.id}-${index}`}
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}

        <div className='post-meta'>
          <span>{post.likes || 0} Lượt thích</span>
          {post.comments?.length > 0 && (
            <span>{post.comments.length} Bình luận</span>
          )}
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

        <button
          className="share-btn"
          onClick={() => setShowSharePopup(true)}
        >
          <FiShare />
          <span>Chia sẻ</span>
        </button>
      </div>

      {showSharePopup && (
        <div className="share-popup-overlay" onClick={() => setShowSharePopup(false)}>
          <div className="share-popup" onClick={(e) => e.stopPropagation()}>
            <div className="share-popup-header">
              <h4>Chia sẻ bài viết</h4>
              <button className="close-share-popup" onClick={() => setShowSharePopup(false)}>
                &times;
              </button>
            </div>
            <div className="share-popup-body">
              <button className="share-option" onClick={handleFacebookShare}>
                📘 Chia sẻ lên Facebook
              </button>
              <button className="share-option" onClick={() => handleShare('copy')}>
                🔗 Copy link bài viết
              </button>
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
                    <img
                      src={comment.authorAvatar}
                      alt={`${comment.author}'s avatar`}
                      className="avatar-image"
                    />
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
                  <img
                    src={currentUser.avatar}
                    alt={`${currentUser.username}'s avatar`}
                    className="avatar-image"
                  />
                ) : (
                  <FaUserCircle className="default-avatar small" />
                )}
              </div>
              <input
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