import { create } from 'zustand';
import { getCookie, removeCookie, setCookie } from '@/lib/cookieUtil';

// 쿠키에서 로그인 정보 로딩
const loadUserCookie = () => {
  const userInfo = getCookie('user');

  // 닉네임 처리
  if (userInfo && userInfo.nickname) {
    userInfo.nickname = decodeURIComponent(userInfo.nickname);
  }

  return (
    userInfo || {
      id: null,
      email: '',
      nickname: '',
      status: '',
      role: '',
      loginType: '',
    }
  );
};

const useLoginStore = create((set) => {
  const initialState = loadUserCookie();

  return {
    ...initialState,

    login: (payload) => {
      console.log('login....');
      setCookie('user', JSON.stringify(payload), 1); // 쿠키 생성(1일)
      set(payload);
    },

    logout: () => {
      console.log('logout...');
      removeCookie('user'); // 쿠키 삭제
      set({
        id: null,
        email: '',
        nickname: '',
        status: '',
        role: '',
        loginType: '',
      });
    },
  };
});

export default useLoginStore;
