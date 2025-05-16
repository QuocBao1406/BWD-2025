import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const email = searchParams.get('email');
    const fallbackName = searchParams.get('name');
    const fallbackAvatar = searchParams.get('avatar');
    const fallbackProvider = searchParams.get('provider');

    if (!email) {
      navigate('/login');
      return;
    }
    
    const user = {
      email,
      name: fallbackName || 'Người dùng',
      username: fallbackName,
      avatar: fallbackAvatar || 'https://example.com/default-avatar.png',
      provider: fallbackProvider || 'local',
    };
    setUser(user);

  }, [navigate, searchParams, setUser]);

  return <div>Đang đăng nhập...</div>;
};

export default OAuthSuccess;