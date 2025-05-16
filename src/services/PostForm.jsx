import React, { useState, useRef } from 'react';
import '../styles/news.scss';

const PostForm = ({ onPostSubmit, onClose }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    for (let file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          setImages((prev) => [...prev, data.url]); // URL ảnh dạng: /uploads/xyz.jpg
        } else {
          alert('Upload ảnh thất bại');
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi khi upload ảnh');
      }
    }

    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const localUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'));
    if (!localUser) {
      alert('Chưa đăng nhập');
      return;
    }

    const postData = {
      content,
      images,
      authorId: localUser.id,
      author: localUser.name || localUser.username,
      authorAvatar: localUser.avatar,
    };

    onPostSubmit(postData);  // Chỉ gửi dữ liệu về News.jsx xử lý
    onClose();
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className='post-creator-popup'>
      <div className='post-creator-header'>
        <h3>Tạo Bài Viết</h3>
        <button className='close-btn' type='button' onClick={onClose}>&times;</button>
      </div>

      <div className='post-creator-body'>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Bạn đang nghĩ gì?'
          rows={5}
          autoFocus
        />
      </div>

      <div className='image-preview-container'>
        {images.map((img, index) => (
          <div key={index} className='image-preview-item'>
            <img src={`http://localhost:5000${img}`} alt={`preview ${index}`} />
            <button type='button' onClick={() => removeImage(index)} className='remove-image-btn'>&times;</button>
          </div>
        ))}
      </div>

      <div className='post-creator-footer'>
        <div className='attachment-options'>
          <button type='button' onClick={() => fileInputRef.current.click()} className='add-photo-btn'>
            📷 Ảnh
          </button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept='image/*'
            style={{ display: 'none' }}
          />
        </div>

        <button
          type='submit'
          className='post-submit-btn'
          disabled={isUploading || (!content.trim() && images.length === 0)}
        >
          {isUploading ? 'Đang tải ảnh...' : 'Đăng'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;