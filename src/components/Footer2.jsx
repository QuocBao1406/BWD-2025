import React from 'react';
import '../styles/footer2.scss';
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';
import logo from '../assets/images/logo/vku-logo.png';

const members = [
  { name: 'Nguyễn Hữu Quốc Bảo', id: '24IT019' },
  { name: 'Trần Thanh Đức', id: '24IT341' },
  { name: 'Lê Hoài Đức', id: '24IT339' },
  { name: 'Lê Đăng Khoa', id: '24IT119' },
];

const Footer2 = () => {
  return (
    <footer className="footer">
      <div className="footer-members">
        {members.map((member, index) => (
          <div className="member" key={index}>
            <p className="member-name">{member.name}</p>
            <p className="member-id">MSV: {member.id}</p>
            <div className="member-icons">
              <FaFacebook />
              <FaGithub />
              <FaInstagram />
            </div>
          </div>
        ))}
      </div>

      <div className="footer-info">
        <p>
          Copyright © 2022 - Trường Đại học Công nghệ Thông tin & Truyền Thông Việt - Hàn, Đại học Đà Nẵng
        </p>
        <p>Địa chỉ: 470 Đường Trần Đại Nghĩa, Hoà Hải, Ngũ Hành Sơn, Đà Nẵng</p>
        <img
          src={logo}
          alt="VKU Logo"
          className="vku-logo"
        />
      </div>
    </footer>
  );
};

export default Footer2;