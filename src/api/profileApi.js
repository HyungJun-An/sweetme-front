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

export const updateMyProfile = async (profileData, imageFile) => {
  let config = {};
  let data;

  if (imageFile) {
    // 이미지 파일이 있는 경우
    const formData = new FormData();
    formData.append('profileData', new Blob([JSON.stringify(profileData)], { type: 'application/json' }));
    formData.append('file', imageFile);

    config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    data = formData;
  } else {
    // 이미지 파일이 없는 경우
    config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    data = profileData;
  }

  console.log('headers: ', config);
  console.log('data: ', data);

  const res = await jwtAxios.put(`${BASE_URL}/profile/me`, data, config);
  return res.data;
};

export const getOtherProfile = async (profileId) => {
  const res = await jwtAxios.get(`${BASE_URL}/profile/${profileId}`);
  return res.data;
};

// TODO: 이미지 조회 경로
export const getImageUrl = (path) => {
  if (!path) return null;

  // 이미 완전한 URL 이거나 blob URL 인 경우 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  const requestPath = `${BASE_URL}${path}`;

  console.log('requestPath: ', requestPath);

  return requestPath;
};
