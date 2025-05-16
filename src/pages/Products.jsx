import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Products.scss'; // Thêm CSS cho trang sản phẩm
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const PRODUCTS = [
  {
    id: 1,
    name: 'Kính thời trang',
    price: 45900,
    colors: ['Đen', 'Xám', 'Nâu'],
    image: '../img/product1.webp'
  },
  {
    id: 2,
    name: 'Bình nước inox',
    price: 150000,
    colors: ['Navy', 'Đen', 'Đỏ'],
    image: '../img/product2.webp'
  },
  {
    id: 3,
    name: 'Giỏ dã ngoại',
    price: 250000,
    colors: ['Hồng', 'Vàng', 'Xanh lá'],
    image: '../img/product3.webp'
  },
  {
    id: 4,
    name: 'Kem chống nắng',
    price: 120000,
    colors: ['Xanh lá', 'Hồng', 'Xanh'],
    image: '../img/product4.webp'
  },
  {
    id: 5,
    name: 'Khăn tắm sợi tre',
    price: 80000,
    colors: ['Xanh', 'Cam', 'Hồng'],
    image: '../img/product5.webp'
  },
  {
    id: 6,
    name: 'Túi đan thủ công',
    price: 100000,
    colors: ['Đỏ', 'Be', 'Kaki'],
    image: '../img/product6.webp'
  },
  {
    id: 7,
    name: 'Thảm picnic',
    price: 200000,
    colors: ['Vàng', 'Hồng', 'Xanh'],
    image: '../img/product7.webp'
  },
  {
    id: 8,
    name: 'Đèn pin năng lượng mặt trời',
    price: 250000,
    colors: ['Xanh lá', 'Đen', 'Vàng'],
    image: '../img/product8.webp'
  },
  {
    id: 9,
    name: 'Balo du lịch',
    price: 500000,
    colors: ['Đen', 'Xanh', 'Xám'],
    image: '../img/product9.webp'
  },
  {
    id: 10,
    name: 'Nón du lịch',
    price: 50000,
    colors: ['Be', 'Trắng', 'Cà phê'],
    image: '../img/product10.webp'
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [formData, setFormData] = useState({ color: '', size: '', quantity: 1, name: '', address: '', phone: '' });

  useEffect(() => {
    emailjs.init('ucpvNgWaQb5t7FmhM');
  }, []);

  const handleBuyNow = (product) => {
    setModalProduct(product);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { color, size, quantity, name, address, phone } = formData;
    if (!color || !size || quantity < 1) {
      alert('Vui lòng chọn đầy đủ thông tin sản phẩm!');
      return;
    }

    emailjs
      .send('dulichxanhastral', 'template_j7ah4od', {
        product_name: modalProduct.name,
        product_price: modalProduct.price.toLocaleString('vi-VN') + ' VND',
        product_size: size,
        product_color: color,
        quantity_input: quantity,
        buyer_name: name,
        buyer_phone: phone,
        buyer_address: address,
      })
      .then(() => {
        alert('Đặt hàng thành công! Email đã được gửi đến người bán.');
        setModalProduct(null);
        setFormData({ color: '', size: '', quantity: 1, name: '', address: '', phone: '' });
      })
      .catch((error) => {
        console.error('Lỗi khi gửi email:', error);
        alert('Có lỗi xảy ra khi gửi email. Vui lòng thử lại.');
      });
  };

  const filteredProducts = PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="products-page">
      <video autoPlay muted loop id="background-video">
        <source src="/img/0513.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      <div className="search-bar">
        <input
          type="text"
          id="search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="item">
            <div className="image-box">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="details">
              <h2>{product.name}</h2>
              <div className="buttons">
                <Link to={`/product-detail/${product.id}`} className="btn btn-info">Tìm Hiểu</Link>
                <button className="btn btn-buy" onClick={() => handleBuyNow(product)}>Mua Ngay</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="modal" onClick={() => setModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setModalProduct(null)}>&times;</span>
            <h2>Mua Ngay</h2>
            <p id="current-price">Giá: {modalProduct.price.toLocaleString('vi-VN')} VND</p>
            <form onSubmit={handleFormSubmit} id="buy-now-form">
              <label>Chọn Màu:</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                required
              >
                <option value="">Chọn màu</option>
                {modalProduct.colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label>Chọn Size:</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              >
                <option value="">Chọn size</option>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>

              <label>Số lượng:</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />

              <label>Họ và Tên:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <label>Địa Chỉ:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <label>Số Điện Thoại:</label>
              <input
                type="tel"
                pattern="0[0-9]{9}"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <button type="submit">Mua</button>
            </form>
          </div>
        </div>
      )}

      <Link to="/cart" className="cart-button">
        <FaShoppingCart />
      </Link>
    </div>
  );
};

export default Products;