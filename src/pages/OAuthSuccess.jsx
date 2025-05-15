import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const avatar = searchParams.get('avatar');
        const provider = searchParams.get('provider');

        const user = {
            name,
            email,
            avatar,
            // provider: 'google'
            provider
        };

        localStorage.setItem('user', JSON.stringify(user));

        // ✅ Sau khi xử lý xong, về trang chủ
        navigate('/');
    }, [navigate, searchParams]);

    return <div>Đang đăng nhập...</div>;
};

export default OAuthSuccess;