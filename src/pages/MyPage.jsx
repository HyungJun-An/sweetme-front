import MyPageLayout from '@/components/MyPageLayout';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/mypage') {
      navigate('/mypage/profile');
    }
  }, [navigate]);

  return (
    <MyPageLayout currentPath={window.location.pathname}>
      <Outlet></Outlet>
    </MyPageLayout>
  );
};
export default MyPage;
