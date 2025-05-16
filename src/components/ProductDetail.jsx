import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import '../styles/ProductDetail.scss'; // Thêm CSS cho trang chi tiết sản phẩm

const productData = [
  {
    id: '1',
    name: 'Kính mát thời trang',
    price: { current: '₫45.900', old: '₫90.000', discount: '-50%' },
    description: 'Kính thời trang, bảo vệ mắt khỏi ánh nắng mặt trời.',
    images: [
      '../img/product1.webp',
      '../img/product1-1.webp',
      '../img/product1-2.jpg'
    ],
    options: { colors: ['Đen', 'Xám', 'Nâu'] },
  },
  {
    id: '2',
    name: 'Bình nước inox',
    price: { current: '₫150.000', old: '₫200.000', discount: '-25%' },
    description: 'Bình nước inox giữ nhiệt, dung tích 500ml.',
    images: [
      '../img/product2.webp',
      '../img/product2-1.webp',
      '../img/product2-2.webp'
    ],
    options: { colors: ['Navy', 'Đen', 'Đỏ'] },
  },
  {
    id: '3',
    name: 'Giỏ dã ngoại',
    price: { current: '₫250.000', old: '₫300.000', discount: '-17%' },
    description: "Giỏ dã ngoại dung tích lớn, dễ dàng mang theo.",
    images: [
      '../img/product3.webp',
      '../img/product3-1.webp',
      '../img/product3-2.webp'
    ],
    options: { colors: ['Hồng', 'Vàng', 'Xanh lá'] },
  },
  {
    id: '4',
    name: 'Kem chống nắng',  
    price: { current: '₫120.000', old: '₫150.000', discount: '-20%' },
    description: 'Kem chống nắng SPF 50+, bảo vệ da khỏi tác hại của ánh nắng mặt trời.',
    images: [
      '../img/product4.webp',
      '../img/product4-1.webp',
      '../img/product4-2.webp'
    ],
    options: { colors: ['Xanh lá', 'Hồng', 'Xanh'] },
  },
  {
    id: '5',
    name: 'Khăn tắm sợi tre',
    price: { current: '₫80.000', old: '₫100.000', discount: '-20%' },
    description: 'Khăn tắm sợi tre mềm mại, thấm hút tốt.',
    images: [
      '../img/product5.webp',
      '../img/product5-1.webp',
      '../img/product5-2.webp'
    ],
    options: { colors: ['Xanh', 'Cam', 'Hồng'] },
  },

  {
    id: '6',
    name: 'Túi đan thủ công',
    price: { current: '₫100.000', old: '₫150.000', discount: '-14%' },
    description: 'Túi đan thủ công, phong cách vintage.',
    images: [
      '../img/product6.webp',
      '../img/product6-1.webp',
      '../img/product6-2.webp'
    ],
    options: { colors: ['Đỏ', 'Be', 'Kaki'] },
  },
  {
    id: '7',
    name: 'Thảm picnic',
    price: { current: '₫200.000', old: '₫250.000', discount: '-20%' },
    description: 'Thảm picnic bằng vải tái chế, chống thấm nước, dễ dàng vệ sinh.',
    images: [
      '../img/product7.webp',
      '../img/product7-1.webp',
      '../img/product7-2.webp'
    ],
    options: { colors: ['Vàng', 'Hồng', 'Xanh'] },
  },
  {
    id: '8',
    name: 'Đèn pin năng lượng mặt trời',
    price: { current: '₫250.000', old: '₫300.000', discount: '-17%' },
    description: 'Đèn pin năng lượng mặt trời, tiết kiệm điện năng.',
    images: [
      '../img/product8.webp',
      '../img/product8-1.webp',
      '../img/product8-2.webp'
    ],
    options: { colors: ['Xanh lá', 'Đen', 'Vàng'] },
  },
  {
    id: '9',
    name: 'Balo du lịch',
    price: { current: '₫500.000', old: '₫600.000', discount: '-17%' },
    description: 'Balo du lịch chống nước, dung tích lớn, phù hợp cho các chuyến đi dài ngày.',
    images: [
      '../img/product9.webp',
      '../img/product9-1.webp',
      '../img/product9-2.webp'
    ], 
    options: { colors: ['Đen', 'Xanh', 'Xám'] },
  },
  {
    id: '10',
    name: 'Nón du lịch',
    price: { current: '₫50.000', old: '₫70.000', discount: '-17%' },
    description: 'Nón du lịch chống nắng, có thể gấp gọn lại dễ dàng.',
    images: [
      '../img/product10.webp',
      '../img/product10-1.webp',
      '../img/product10-2.webp'
    ],
    options: { colors: ['Be', 'Trắng', 'Cà phê'] },
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = productData.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images?.[0] || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    emailjs.init('ucpvNgWaQb5t7FmhM');
  }, []);

  if (!product) return <p style={{ textAlign: 'center' }}>Sản phẩm không tồn tại!</p>;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Vui lòng chọn màu và size trước khi thêm vào giỏ hàng!');
      return;
    }

    const cartItem = {
      name: product.name,
      price: Number(product.price.current.replace(/[₫\.\,]/g, '')), // chuyển sang số nguyên
      image: mainImage,
      color: selectedColor,
      size: selectedSize,
      quantity,
    };

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize || quantity <= 0) {
      alert('Vui lòng chọn đầy đủ thông tin trước khi mua!');
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    emailjs
      .send('dulichxanhastral', 'template_j7ah4od', {
        product_name: product.name,
        product_price: product.price.current,
        product_color: selectedColor,
        product_size: selectedSize,
        product_quantity: quantity,
        buyer_name: buyerInfo.name,
        buyer_address: buyerInfo.address,
        buyer_phone: buyerInfo.phone
      })
      .then(() => {
        alert('Đặt hàng thành công! Email đã được gửi.');
        setModalOpen(false);
      })
      .catch((error) => {
        console.error('Lỗi khi gửi email:', error);
        alert('Có lỗi xảy ra khi gửi email.');
      });
  };

  return (
    <div className="container">
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img src={mainImage} alt="Hình ảnh sản phẩm" />
          </div>
          <div className="image-thumbnails">
            {product.images.map((img, index) => (
              <img key={index} className="thumbnail" src={img} alt={`Hình ảnh ${index + 1}`} onClick={() => setMainImage(img)} />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            <span className="current-price">{product.price.current}</span>
            <span className="old-price">{product.price.old}</span>
            <span className="discount">{product.price.discount}</span>
          </div>

          <div className="product-options">
            <div className="option">
              <label>Phân Loại Màu:</label>
              <div className="choices">
                {product.options.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`choice color ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="option">
              <label>Phân Loại Size:</label>
              <div className="choices">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className={`choice size ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="quantity">
            <label>Số Lượng:</label>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="add-cart" onClick={handleAddToCart}>Thêm Vào Giỏ Hàng</button>
            <button className="buy-now" onClick={handleBuyNow}>Mua Ngay</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Thông Tin Người Mua</h2>
            <form onSubmit={handleSubmitOrder}>
              <label>Họ và Tên:</label>
              <input type="text" required value={buyerInfo.name} onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })} />
              <label>Địa Chỉ:</label>
              <input type="text" required value={buyerInfo.address} onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })} />
              <label>Số Điện Thoại:</label>
              <input type="tel" pattern="0[0-9]{9}" required value={buyerInfo.phone} onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })} />
              <button type="submit">Hoàn Thành Đặt Hàng</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;