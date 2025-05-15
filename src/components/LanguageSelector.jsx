import React, { useState, useEffect, useRef } from 'react';
import i18n from '../i18n';
import '../styles/LanguageSelector.scss';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'us' },
  { code: 'vi', label: 'Tiếng Việt', flag: 'vn' },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('appLanguage', code);

    document.body.classList.remove('lang-en', 'lang-vi');
    document.body.classList.add(`lang-${code}`);

    setIsOpen(false);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    document.body.classList.remove('lang-en', 'lang-vi');
    document.body.classList.add(`lang-${savedLang}`);

    // Đóng dropdown khi click ngoài
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

  const currentFlag = LANGUAGES.find((l) => l.code === currentLang)?.flag || 'us';

  return (
    <div className="language-selector" ref={menuRef} onClick={() => setIsOpen(!isOpen)}>
      <div className="selected-lang">
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${currentFlag}.svg`}
          alt="Flag"
          className="flag-icon"
        />
        <span className="lang-code">{currentLang.toUpperCase()}</span>
      </div>
      <ul className={`lang-dropdown ${isOpen ? 'active' : ''}`}>
        {LANGUAGES.map((lang) => (
          <li key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            <img
              src={`https://hatscripts.github.io/circle-flags/flags/${lang.flag}.svg`}
              alt={lang.label}
              className="flag-icon"
            />
            <span>{lang.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSelector;