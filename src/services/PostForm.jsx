import React, { useState, useRef } from 'react';
import '../styles/news.scss';

const PostForm = ({ onPostSubmit, onClose }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;

    onPostSubmit({ content, images });
    setContent('');
    setImages([]);
    onClose();
  };

  return (
    <div className='post-creator-popup'>
      <div className='post-creator-header'>
        <h3>Tạo Bài Viết</h3>
        <button 
          className='close-btn' 
          onClick={onClose}
          aria-label='Đóng'
        >
          &times;
        </button>
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
            <img src={img} alt={`preview ${index}`} />
            <button
              onClick={() => removeImage(index)}
              className='remove-image-btn'
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className='post-creator-footer'>
        <div className='attachment-options'>
          <button
            type='button'
            onClick={() => fileInputRef.current.click()}
            className='add-photo-btn'
          >
            📷 Ảnh/Video
          </button>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept='image/*,video/*'
            style={{ display: 'none' }}
          />
        </div>

        <button
          type='submit'
          onClick={handleSubmit}
          className='post-submit-btn'
          disabled={!content.trim() && images.length === 0}
        >
          Đăng
        </button>
      </div>
    </div>
  );
};

export default PostForm;