import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getAccessToken } from '@/api/kakaoApi';

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();

  const authCode = searchParams.get('code');

  useEffect(() => {
    getAccessToken(authCode).then(
      (data) => {
        console.log('accessToken: ', data);
      },
      [authCode],
    );
  });

  console.log('kakao redirect page');

  return (
    <div>
      <div>KAKAO Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
