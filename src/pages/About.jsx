import React, { useState } from 'react';
import '../styles/About.scss';
import bao from '../assets/images/about/anhs.jpg';
import gai from '../assets/images/about/girl-8136225.jpg';

const previewImages = [
  bao,
  gai,
  bao,
  bao
];

const AboutPage = () => {
  const members = [
    {
      img: bao,
      name: 'Nguyễn Hữu Quốc Bảo',
      role: 'Trưởng nhóm',
      quote: 'Tôi không phải là siêu nhân, nhưng tôi có thể biến deadline thành động lực, biến bug thành bài học, và biến cà phê thành... sản phẩm chạy được!',
      preview: 'member4-small.jpg'
    },
    {
      img: gai,
      name: 'Trần Thanh Đức',
      role: 'Lập trình',
      quote: 'Mây núi ngàn năm, sóng biển vỗ mãi – đất Việt trao ta sự sống, hãy đáp lại bằng tình yêu.',
      preview: 'anhs.jpg'
    },
    {
      img: bao,
      name: 'Lê Hoài Đức',
      role: 'Thiết kế',
      quote: 'đi là để trải nghiệm, đi là để học.',
      preview: 'girl-8093350.jpg'
    },
    {
      img: bao,
      name: 'Lê Đăng Khoa',
      role: 'Hậu cần',
      quote: 'Hãy sống như thể ngày mai ta sẽ đi xa.',
      preview: 'member3.jpg'
    }
  ];

  const [current, setCurrent] = useState(0);
  const total = members.length;

  const prevIndex = (current - 1 + total) % total;
  const nextIndex = (current + 1) % total;

  const handlePrev = () => {
    setCurrent((current - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrent((current + 1) % total);
  };

  return (
    <div className="about-page">
      <div className="about-rotating">
        <div className="about-banner">
          <div className="about-slider" style={{ "--quantity": 10 }}>
            {[
              'anhs.jpg',
              'vietnam-1745819.jpg',
              'waterfall-7397017.jpg',
              'temple-5893180.jpg',
              'vietnam-7561525.jpg',
              'ancient-6696940.jpg',
              'ao-dai-6152101.jpg',
              'boy-7873231.jpg',
              'lantern-5235537.jpg',
              'canh-chua-6762329.jpg',
            ].map((src, index) => (
              <div className="about-item" style={{ "--position": index + 1 }} key={index}>
                <img src={require(`../assets/images/about/${src}`)} alt={`about-${index}`} />
              </div>
            ))}
          </div>
          <div className="about-content">
            <h1 data-content="VIET NAM">VIET NAM</h1>
            <div className="about-author">
              <h2>TRAVEL</h2>
              <p><b>VIET NAM</b></p>
              <p style={{ color: 'white' }}>
                Thiên nhiên Việt Nam đẹp đến mức khiến thời gian cũng phải chậm lại để ngắm nhìn
              </p>
            </div>
            <div class="about-model"></div>
          </div>
        </div>
      </div>

      <section className="about-intro-section">
        <div className="about-content-wrapper">
          <h1>Giới Thiệu Nhóm</h1>
          <p>
            Chúng tôi là nhóm những bạn trẻ đam mê du lịch xanh, khám phá và bảo vệ thiên nhiên Việt Nam.
            Từ rừng núi nguyên sơ đến bờ biển trong lành, mỗi hành trình đều là cơ hội để kết nối và lan tỏa tình yêu với môi trường.
          </p>
          <p>
            Mục tiêu của nhóm là truyền cảm hứng cho mọi người cùng khám phá và bảo vệ vẻ đẹp tự nhiên bền vững, đồng thời chia sẻ những trải nghiệm du lịch xanh ý nghĩa.
          </p>
        </div>
      </section>

      <section className="about-vision-section">
        <div className="about-wrapper">
          <h1>Tầm Nhìn & Sứ Mệnh</h1>
          <div className="about-vision-mission">
            <div className="about-vision">
              <h2>Tầm Nhìn</h2>
              <p>
                Trở thành cộng đồng du lịch xanh hàng đầu, truyền cảm hứng cho thế hệ trẻ yêu thiên nhiên, 
                hướng tới những chuyến đi bền vững và đầy ý nghĩa trên khắp mọi miền Việt Nam.
              </p>
            </div>
            <div className="about-mission">
              <h2>Sứ Mệnh</h2>
              <p>
                Khám phá, kết nối và bảo tồn vẻ đẹp tự nhiên Việt Nam; nâng cao nhận thức cộng đồng về du lịch bền vững, 
                góp phần xây dựng tương lai xanh hơn qua mỗi hành trình.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-contact-section">
        <h1>Liên Hệ Với Chúng Tôi</h1>
        <div className="about-contact-wrapper">
          <div className="about-contact-info">
            <div className="about-contact-item"><strong>Email:</strong> baonhq.24it@vku.udn.vn</div>
            <div className="about-contact-item"><strong>Điện thoại:</strong> 0777416436</div>
            <div className="about-contact-item"><strong>Địa chỉ:</strong> Trường Đại học Công Nghệ Thông Tin Và Truyền Thông Việt Hàn</div>
          </div>
          <div className="about-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1531.7051276038333!2d108.25218309231059!3d15.976062199935269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142108997dc971f%3A0x1295cb3d313469c9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiB2w6AgVHJ1eeG7gW4gdGjDtG5nIFZp4buHdCAtIEjDoG4sIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e1!3m2!1svi!2s!4v1748840573690!5m2!1svi!2s" 
              width="100%" 
              height="350" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <h1>Thành Viên Nhóm</h1>
        <div className="about-team-carousel">
          <button className="about-team-prev" onClick={handlePrev}>
            <img src={previewImages[prevIndex]} alt="Previous Member" />
          </button>

          <div className="about-team-member active">
          <img src={members[current].img} alt={members[current].name} />
          <h2>{members[current].name}</h2>
          <div className="about-role">{members[current].role}</div>
          <blockquote>"{members[current].quote}"</blockquote>
        </div>

          <button className="about-team-next" onClick={handleNext}>
            <img src={previewImages[nextIndex]} alt="Next Member" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;