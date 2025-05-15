import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserMenu.scss';
import { useTranslation } from 'react-i18next';

const UserMenu = ({ user }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    // Đóng dropdown nếu click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-menu" ref={menuRef} onClick={() => setIsOpen(!isOpen)}>
            <img src={user.avatar} alt="avatar" className="avatar" />
            <ul className={`dropdown ${isOpen ? 'active' : ''}`}>
                <li><Link to="/profile">{t('nav.profile')}</Link></li>
                <li onClick={handleLogout}><Link to="/logout">{t('nav.logout')}</Link></li>
            </ul>
        </div>
    );
};

export default UserMenu;