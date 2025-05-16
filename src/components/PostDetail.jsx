import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/PostDetail.scss';

function PostDetail({ readonly = false }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        try {
          data.images = JSON.parse(data.images || '[]');
        } catch {
          data.images = [];
        }
        data.author = data.author_name || 'Ẩn danh';
        setPost(data);
        setLikes(data.likes || 0);
      })
      .catch(err => console.error('Không tìm thấy bài viết', err));
  }, [id]);

  if (!post) return <div style={{ padding: 20 }}>Đang tải bài viết...</div>;

  return (
    <div className="post-detail-container">
      <div className="post-card">
        {/* Tiêu đề và người đăng */}
        <div className="post-header">
          <div className="avatar">
            <img
              src={post.author_avatar || '/default-avatar.png'}
              alt="avatar"
              onError={(e) => e.target.src = '/default-avatar.png'}
            />
          </div>
          <div className="author-info">
            <h3>{post.author}</h3>
            <span className="date">{new Date(post.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Nội dung */}
        <div className="post-content">
          <p>{post.content}</p>
        </div>

        {/* Ảnh */}
        {post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((img, index) => (
              <img key={index} src={`http://localhost:5000${img}`} alt={`img-${index}`} />
            ))}
          </div>
        )}

        {/* Like - chỉ hiển thị số, không cho like nếu readonly */}
        <div className="like-section">
          <div className="like-display">❤️ {likes} lượt thích</div>
        </div>

        {/* Bình luận */}
        <div className="comments-section">
          <h4>Bình luận ({post.comments?.length || 0})</h4>

          <div className="comments-list">
            {post.comments?.map((comment, index) => (
              <div key={index} className="comment-item">
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;