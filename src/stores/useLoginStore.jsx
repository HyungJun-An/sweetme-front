import { create } from 'zustand';
import { getCookie, removeCookie, setCookie } from '@/lib/cookieUtil';

// 쿠키에서 로그인 정보 로딩
const loadMemberCookie = () => {
  const memberInfo = getCookie('member');

  // 닉네임 처리
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }

  return (
    memberInfo || {
      id: null,
      email: '',
      nickname: '',
      userStatus: '',
    }
  );
};

const useLoginStore = create((set) => {
  const initialState = loadMemberCookie();

  return {
    ...initialState,

    login: (payload) => {
      console.log('login....');
      setCookie('member', JSON.stringify(payload), 1); // 쿠키 생성(1일)
      set(payload);
    },

    logout: () => {
      console.log('logout...');
      removeCookie('member'); // 쿠키 삭제
      set({
        id: null,
        email: '',
        nickname: '',
        userStatus: '',
      });
    },
  };
});

export default useLoginStore;
