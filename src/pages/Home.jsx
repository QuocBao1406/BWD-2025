import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.scss';
import '../i18n';
import imgo1 from '../assets/images/home/imgo1.png'
import imgo2 from '../assets/images/home/imgo2.png'
import imgbackgroundtrang2 from '../assets/images/home/imgbackgroundtrang2.png'
import imgcuadiv2 from '../assets/images/home/imgcuadiv2.png'
import imgTraidat from '../assets/images/home/imgTraidat.png'
import img4noidung from '../assets/images/home/img4noidung.png'
import imgcuatrang4 from '../assets/images/home/imgcuatrang4.png'
import imgtrangcuoi from '../assets/images/home/imgtrangcuoi.png'
import { useTranslation } from 'react-i18next';
import backgroundVideo from '../assets/images/home/backgroundVideo2.mp4'
import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.min.css';

function Home() {
  useEffect(() => {
    function applyVisibilityEffect(selector, effectFn) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const ratio = Math.max(0, Math.min(visibleHeight / rect.height, 1));
        effectFn(el, ratio);
      });
    }

    function handleScrollAnimation() {
      applyVisibilityEffect(".fade-section-trang2", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
      });

      applyVisibilityEffect(".slide-from-right", (el, ratio) => {
        el.style.opacity = ratio;
        el.style.transform = `translateX('${(1 - ratio) * 60}'px)`;
      });

      applyVisibilityEffect(".slide-img", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
        el.classList.toggle("out", ratio <= 0.3);
      });

      applyVisibilityEffect(".slide-text", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
        el.classList.toggle("out", ratio <= 0.3);
      });

      applyVisibilityEffect(".slide-up", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
        el.classList.toggle("out-down", ratio <= 0.3);
      });

      applyVisibilityEffect(".slide-left", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
        el.classList.toggle("out-left", ratio <= 0.3);
      });

      applyVisibilityEffect(".slide-right", (el, ratio) => {
        el.classList.toggle("visible", ratio > 0.3);
        el.classList.toggle("out-right", ratio <= 0.3);
      });
    }

    window.addEventListener("scroll", handleScrollAnimation);
    window.addEventListener("load", handleScrollAnimation);

    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
      window.removeEventListener("load", handleScrollAnimation);
    };
  }, []);

  const { t } = useTranslation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div id="fullpage" className="home-container">
      <div className="trang1">
        <video className="bg-video" autoPlay muted loop playsInline poster="fallback.ipg">
          <source src={backgroundVideo} type="video/mp4" />Trình duyệt không hỗ trợ video
        </video>
        <div className="left-trang1">
          <div className="anhnen"></div>
          <div className="dulich">{t('home.bigTitle1')}</div>
          <div className="xanh">{t('home.bigTitle2')}</div>
          <div className="tieudetrang1">{t('home.subTitle')}</div>
          <div className="nut-trang1">
            <Link to="/travel" className="nut-goiy">{t('home.hintBtn')}</Link>
            {!user && (
              <Link to="/login" className="nut-dangnhap">{t('home.loginBtn')}</Link>
            )}

            {user && (
              <Link to="/news" className="nut-dangnhap">{t('home.newsBtn')}</Link>
            )}
          </div>
        </div>
        <div className="right-trang1">

        </div>
      </div>

      <div className="trang2">
        <div className="trang2-content">
          <div className="left">
            <h1 className="lydo-heading fade-section-trang2">{t('home.reason')}</h1>
            <p className="lydo-description fade-section-trang2">
              {t('home.reasonDescription')}
            </p>
          </div>
          <div className="right">
            <div className="lotanh"></div>
            <img className="anh-bo-goc slide-from-right" src={imgcuadiv2} alt="Ảnh minh họa" />
          </div>
        </div>
        <div className="gear-wrapper fade-section-trang2">
          <img src={imgTraidat} alt="Earth" className="gear-bottom-left" />
        </div>
      </div>


      <div className="trang3">
        <div className="trang3-content">
          <div className="left">
            <div className="anhnen"></div>
            <img className="noidung-img slide-img" src={img4noidung} alt="" />
          </div>

          <div className="right">
            <h1 className="thuctrang slide-text">{t('home.issue')}</h1>
            <ul className="noidung slide-text">
              <li className="noidung-list">{t('home.issue1')}</li>
              <li className="noidung-list">{t('home.issue2')}</li>
              <li className="noidung-list">{t('home.issue3')}</li>
              <li className="noidung-list">{t('home.issue4')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="trang4">
        <div className="trang4-content">
          <div className="anhnen4"></div>
          <img className="imgtrang4 slide-up" src={imgcuatrang4} alt="" />

          <div className="left">
            <div className="khungchu">
              <h1 className="chutrang4h1 slide-left">{t('home.action1')}</h1>
              <h1 className="chutrang4h1-1 slide-left">{t('home.action2')}</h1>
            </div>

            <div className="nuttrang4 slide-left">
              <div className="btn-wrapper">
                <span className="muiten slide-left">↓</span>

                <a href="diadiem.html" className="btntrang4">{t('home.hintBtn')}</a>
              </div>
              <div className="btn-wrapper">
                <span className="muiten slide-left">↓</span>
                <a href="sanpham.html" className="btntrang4">{t('home.product')}</a>
              </div>
            </div>
          </div>

          <div className="right">
            <q className="chutrang4 slide-right">
              {t('home.actionDescription')}
            </q>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;