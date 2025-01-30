import useLoginStore from '@/stores/useLoginStore';
import { Navigate, useNavigate, createSearchParams } from 'react-router-dom';

const useCustomLogin = () => {
  const navigate = useNavigate();

  const exceptionHandle = (ex) => {
    console.log('Exception---------------');
    console.log(ex);

    const errorMsg = ex.response.data.error;
    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (errorMsg === 'REQUIRE_LOGIN') {
      alert('로그인이 필요합니다.');
      navigate({ pathname: `/login`, search: errorStr });
      return;
    }

    if (errorMsg === 'ERROR_ACCESSDENIED') {
      alert('해당 메뉴를 사용 권한이 없습니다.');
      navigate({ pathname: '/login', search: errorStr });
      return;
    }
  };

  const loginState = useLoginStore((state) => state.email); // 로그인 상태
  const isLogin = loginState ? true : false; // 로그인 여부

  // 페이지 이동
  const moveToPath = (path) => {
    navigate({ pathname: path }, { replace: true });
  };

  // 로그인 페이지 이동
  const moveToLogin = () => {
    navigate({ pathname: '/login' }, { replace: true });
  };

  // 로그인 페이지 이동 컴포넌트
  const moveToLoginReturn = () => {
    return <Navigate replace to={'/login'}></Navigate>;
  };

  return { loginState, isLogin, moveToPath, moveToLogin, moveToLoginReturn, exceptionHandle };
};
