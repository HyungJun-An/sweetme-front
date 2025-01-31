import axios from 'axios';
import { BASE_URL } from './api';

const rest_api_key = import.meta.env.VITE_kakao_rest_api_key;
const redirect_uri = `http://localhost:5173/login/kakao`;
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
const access_token_url = `https://kauth.kakao.com/oauth/token`;
const client_secret_code = import.meta.env.VITE_kakao_client_secret_code;

export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  return kakaoURL;
};

export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  console.log('header: ', header);

  const params = {
    grant_type: 'authorization_code',
    client_id: rest_api_key,
    client_secret: client_secret_code,
    redirect_uri: redirect_uri,
    code: authCode,
  };

  console.log('params: ', params);

  const res = await axios.post(access_token_url, params, header);
  const accessToken = res.data.access_token;
  return accessToken;
};

export const getUserWithAccessToken = async (accessToken) => {
  const res = await axios.get(`${BASE_URL}/auth/login/kakao?accessToken=${accessToken}`);

  return res.data;
};
