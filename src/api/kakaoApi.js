import axios from 'axios';
import { BASE_URL } from './api';

const rest_api_key = `f2c2c619e633110aca84b0fa5d7042ca`;
const redirect_uri = `http://localhost:5173/login/kakao`;
const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;
const access_token_url = `https://kauth.kakao.com/oauth/token`;
const client_secret_code = `XiDwmK5O20F0yYTx0nLTW1ajfCSHrvkX`;

export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  return kakaoURL;
};

export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      'Content-Type': 'application/x-www-form/urlencoded;charset=utf-8',
    },
  };

  const params = {
    grant_type: 'authorization_code',
    client_id: rest_api_key,
    client_secret: client_secret_code,
    redirect_uri: redirect_uri,
    code: authCode,
  };

  const res = await axios.post(access_token_url, params, header);
  const accessToken = res.data.access_token;
  return accessToken;
};
