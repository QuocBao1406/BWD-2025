import React, { useEffect, useState } from 'react';
import '../styles/About.scss'; // Import CSS cho trang About

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    <div className="slide slide1" key={0}></div>,

    <div className="slide slide2" key={1}>
      <div className="gioithieu">
        <div className="gioi" style={{ fontSize: '48px' }}>Giới</div>
        <div className="thieu" style={{ fontSize: '48px' }}>Thiệu</div>
        <div className="noidunggthieu">
          Dự án “Du Lịch Xanh” là một nền tảng website truyền cảm hứng sống xanh, giúp bạn khám phá các địa điểm du lịch sinh thái và hướng tới phong cách sống bền vững, thân thiện với môi trường.
        </div>
      </div>

      <div className="traidat">
        <img src="/img/earth_image_placeholder.png" alt="Trái Đất" className="traidat" />
      </div>

      <div className="muctieu">
        <div className="muc" style={{ fontSize: '48px' }}>Mục</div>
        <div className="tieu" style={{ fontSize: '48px' }}>Tiêu</div>
        <div className="noidungmuctieu">
          Nhằm xây dựng một nền tảng truyền cảm hứng cho cộng đồng, đặc biệt là giới trẻ, về phong cách du lịch thân thiện với môi trường và phát triển bền vững.
        </div>
      </div>
    </div>,

    ...[3, 4, 5, 6, 7].map((num) => (
      <div className="slide" key={num}>
        <h2>Slide {num}</h2>
        <p>Đây là slide {num}</p>
      </div>
    ))
  ];

  const changeSlide = (direction) => {
    setCurrentIndex((prevIndex) => (prevIndex + direction + slides.length) % slides.length);
  };

  // Tự động chuyển slide mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide(1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      <div className="slides">
        {slides.map((slide, index) => (
          <div
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            key={index}
            style={{ display: index === currentIndex ? 'block' : 'none' }}
          >
            {slide}
          </div>
        ))}
      </div>

      <button className="prev" onClick={() => changeSlide(-1)}>&#10094;</button>
      <button className="next" onClick={() => changeSlide(1)}>&#10095;</button>
    </div>
  );
};

export default About;