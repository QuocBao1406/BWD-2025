import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Cart.scss';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', address: '', phone: '' });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Chuyển giá về số nếu chưa phải số (phòng trường hợp lưu chuỗi)
    const parsedCart = savedCart.map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseInt(item.price.replace(/[₫\.\,]/g, ''), 10) : item.price,
      quantity: item.quantity || 1,
    }));
    setCart(parsedCart);
    emailjs.init('ucpvNgWaQb5t7FmhM');
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleQuantityChange = (index, value) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, parseInt(value) || 1);
    updateCart(newCart);
  };

  const handleRemove = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const handleBuyOne = (index) => {
    setSelectedProductIndex(index);
    setModalOpen(true);
  };

  const handleBuyAll = () => {
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    setSelectedProductIndex(null);
    setModalOpen(true);
  };

  const getColorCode = (name) => {
    const colors = {
      Trắng: '#fff',
      Xám: '#808080',
      Hồng: '#FFC0CB',
      Nâu: '#A52A2A',
      Xanh: '#0000FF',
      Đen: '#000000',
      Đỏ: '#FF0000',
      Vàng: '#FFD700',
      Be: '#F5F5DC',
      'Xanh lá': '#228B22',
      Kaki: '#F0E68C',
      'Cà phê': '#6F4E37',
    };
    return colors[name] || '#000';
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    // Tạo bản sao của giỏ hàng để tránh tham chiếu nhầm lẫn
    let productsToOrder;
    let newCart;

    if (selectedProductIndex === null) {
      // Mua tất cả sản phẩm
      productsToOrder = [...cart];  // sao chép để giữ nguyên dữ liệu
      newCart = [];  // giỏ hàng mới sẽ trống
    } else {
      // Mua một sản phẩm
      productsToOrder = [cart[selectedProductIndex]];
      newCart = cart.filter((_, idx) => idx !== selectedProductIndex);
    }

    // Tạo nội dung chi tiết sản phẩm
    const productDetails = productsToOrder.map(item => 
      `- Tên sản phẩm: ${item.name}\n` +
      `- Giá: ${item.price}\n` +
      `- Kích thước: ${item.size}\n` +
      `- Màu sắc: ${item.color}\n` +
      `- Số lượng: ${item.quantity}\n`
    ).join('\n');

    emailjs
      .send('dulichxanhastral', 'template_3nnken4', {
        buyer_name: buyerInfo.name,
        buyer_address: buyerInfo.address,
        buyer_phone: buyerInfo.phone,
        product_details: productDetails,
      })
      .then(() => {
        alert('Đặt hàng thành công!');

        // Cập nhật lại giỏ hàng sau khi gửi email thành công
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));

        setModalOpen(false);
      })
      .catch((error) => {
        console.error('Lỗi khi gửi email:', error);
        alert('Lỗi khi gửi email. Vui lòng thử lại.');
      });
  };


  return (
    <div className="cart-container">
      <h1>Giỏ Hàng</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Hình Ảnh</th>
            <th>Sản Phẩm</th>
            <th>Phân Loại</th>
            <th>Đơn Giá</th>
            <th>Số Lượng</th>
            <th>Tổng</th>
            <th>Mua</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{item.name}</td>
              <td>
                Size: {item.size} | Màu:
                <span
                  style={{
                    backgroundColor: getColorCode(item.color),
                    width: 20,
                    height: 20,
                    display: 'inline-block',
                    borderRadius: '50%',
                    border: '1px solid #ccc',
                    marginLeft: 5
                  }}
                ></span>
              </td>
              <td>{formatPrice(item.price)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </td>
              <td>{formatPrice(item.price * item.quantity)}</td>
              <td>
                <button onClick={() => handleBuyOne(index)} className="buy-button">Mua</button>
              </td>
              <td>
                <button onClick={() => handleRemove(index)} className="remove-button">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <button onClick={handleBuyAll} id="checkout-all">
          Mua Tất Cả
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Thông Tin Đặt Hàng</h2>
            <form onSubmit={handleSubmitOrder}>
              <label>Họ và Tên:</label>
              <input
                type="text"
                required
                value={buyerInfo.name}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
              />
              <label>Địa Chỉ:</label>
              <input
                type="text"
                required
                value={buyerInfo.address}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
              />
              <label>Số Điện Thoại:</label>
              <input
                type="tel"
                pattern="0[0-9]{9}"
                required
                value={buyerInfo.phone}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
              />
              <button type="submit">Đặt Hàng</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;