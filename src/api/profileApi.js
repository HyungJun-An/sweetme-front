import jwtAxios from '@/lib/jwtUtil';
import { BASE_URL } from './api';

export const getProfileOptions = async () => {
  const res = await jwtAxios.get(`${BASE_URL}/profile/options`);
  return res.data;
};

export const getMyProfile = async () => {
  const res = await jwtAxios.get(`${BASE_URL}/profile/me`);
  return res.data;
};

export const updateMyProfile = async (profileData) => {
  const res = await jwtAxios.put(`${BASE_URL}/profile/me`, profileData);
  return res.data;
};

export const getOtherProfile = async (profileId) => {
  const res = await jwtAxios.get(`${BASE_URL}/profile/${profileId}`);
  return res.data;
};

// TODO: 이미지 조회 API
export const getImageUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}/images/${path}`;
};
