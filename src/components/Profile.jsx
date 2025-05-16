import React, { useEffect, useState } from 'react';
import '../styles/profile.scss';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    provider: '',
    aboutme: '',
  });

  useEffect(() => {
    const localUserString = localStorage.getItem('user');
    if (!localUserString) return;

    const localUser = JSON.parse(localUserString);
    if (!localUser?.id) return;

    setUser(localUser);
    setFormData({
      username: localUser.username || '',
      name: localUser.name || '',
      email: localUser.email || '',
      provider: localUser.provider || 'local',
      aboutme: localUser.aboutme || '',
    });

    localStorage.setItem('backupData', JSON.stringify(localUser));
  }, []);

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to view your profile.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    const backup = JSON.parse(localStorage.getItem('backupData'));
    if (backup) {
      setFormData({
        username: backup.username,
        name: backup.name,
        email: backup.email,
        provider: backup.provider,
        aboutme: backup.aboutme || '',
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          provider: formData.provider,
          aboutme: formData.aboutme,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert('Đã lưu thành công!');
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert('Lỗi khi lưu: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối server.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];

      try {
        const res = await fetch('http://localhost:5000/api/profile/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            avatar: base64String,
          }),
        });

        const result = await res.json();
        if (result.success) {
          alert('Avatar updated!');
          const newUser = { ...user, avatar: reader.result };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          alert('Upload thất bại: ' + result.message);
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi khi upload avatar');
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="profile-container">
        <div className="left-panel">
          <h2>Hồ sơ của tôi</h2>
          <div className="avatar">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: 100, borderRadius: '50%', marginBottom: 10 }}
              />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: '#ccc', marginBottom: 10 }} />
            )}
          </div>
          <div className="upload">
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <form className="right-panel" onSubmit={handleSave}>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} readOnly />

          <label>Tên hiển thị:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Tên sẽ hiển thị công khai"
          />

          <label>E-mail:</label>
          <input type="email" name="email" value={formData.email} readOnly />

          <label>Nhà cung cấp:</label>
          <input type="text" name="provider" value={formData.provider} readOnly />

          <label>Giới thiệu:</label>
          <textarea
            name="aboutme"
            rows="4"
            value={formData.aboutme}
            onChange={handleChange}
            placeholder="Giới thiệu bản thân"
          />

          <div className="button-container">
            <button type="button" className="discard-save-button btn" onClick={handleDiscard}>
              Huỷ
            </button>
            <button type="submit" className="save-button btn">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;