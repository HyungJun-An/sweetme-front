import axios from 'axios';
import { BASE_URL } from './api';
import { data } from 'react-router-dom';

const client_id = import.meta.env.VITE_naver_client_id;
const redirect_uri = `http://localhost:5173/login/naver`;
const auth_code_path = `https://nid.naver.com/oauth2.0/authorize`;
const access_token_url = `https://nid.naver.com/oauth2.0/token`;
const client_secret_code = import.meta.env.VITE_naver_client_secret_code;

export const getNaverLoginLink = () => {
  const randomString = Math.random().toString(36).substring(2, 15); // 36진수를 사용하여 임의의 13자리 문자열 생성
  const state = encodeURIComponent(randomString); // URL 인코딩 적용

  console.log('Generating state: ', state);

  try {
    localStorage.setItem('naverState', state); // state 값을 저장
    console.log('State saved in sessionStorage: ', localStorage.getItem('naverState'));
  } catch (error) {
    console.error('Error saving state to sessionStorage: ', error);
  }

  const naverURL = `${auth_code_path}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`;

  return naverURL;
};

export const getNaverUserWithAuthCode = async (authCode, receivedState) => {
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  console.log('header: ', header);

  // localStorage 에 저장해둔 원래의 state 값과 비교
  const originalState = localStorage.getItem('naverState');

  console.log('getNaverAccessToken 내부');
  console.log('originalState:', originalState);
  console.log('receivedState:', receivedState);
  console.log('originalState type:', typeof originalState);
  console.log('receivedState type:', typeof receivedState);

  if (!originalState || originalState !== receivedState) {
    throw new Error('State token mismatch - possible CSRF attack');
  }

  const params = {
    grant_type: 'authorization_code',
    client_id: client_id,
    client_secret: client_secret_code,
    code: authCode,
    state: receivedState,
  };

  console.log('params: ', params);

  const res = await axios.post(`${BASE_URL}/auth/login/naver`, params);
  console.log(res.data);

  // 사용이 끝난 state 제거
  localStorage.removeItem('naverState');

  return res.data;
};
