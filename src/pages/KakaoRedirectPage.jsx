import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getAccessToken, getUserWithAccessToken } from '@/api/kakaoApi';
import useLoginStore from '@/stores/useLoginStore';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const login = useLoginStore((state) => state.login);
  const authCode = searchParams.get('code');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('인증 처리 중입니다...');
  const processedRef = useRef(false);

  // useEffect(() => {
  //   getAccessToken(authCode).then((accessToken) => {
  //     console.log('accessToken: ', accessToken);

  //     getUserWithAccessToken(accessToken).then((userInfo) => {
  //       console.log('userInfo: ', userInfo);
  //       login(userInfo); // 쿠키 생성
  //       navigate({ pathname: '/' }, { replace: true });
  //     });
  //   });
  // }, [authCode]);

  useEffect(() => {
    const processLogin = async () => {
      try {
        if (processedRef.current) return;
        processedRef.current = true;

        setLoadingStatus('카카오 로그인 인증 처리 중...');
        const accessToken = await getAccessToken(authCode);

        setLoadingStatus('사용자 정보를 가져오는 중...');
        const userInfo = await getUserWithAccessToken(accessToken);

        login(userInfo);
        alert('로그인 되었습니다.');
        navigate({ pathname: '/' }, { replace: true });
      } catch (err) {
        setError(err.message || '로그인 처리 중 오류가 발생했습니다.');

        // 5초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          navigate({ pathname: '/' }, { replace: true });
        }, 5000);
      }
    };

    if (authCode) {
      processLogin();
    } else {
      setError('인증 코드를 찾을 수 없습니다.');
    }
  }, [authCode]);

  console.log('kakao redirect page');

  return (
    // <div>
    //   <div>KAKAO Login Redirect</div>
    //   <div>{authCode}</div>
    // </div>

    <div className="flex h-screen flex-col items-center justify-center p-4">
      {!error ? (
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <div className="text-lg font-medium">{loadingStatus}</div>
          <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
        </div>
      ) : (
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {error}
            <p className="mt-2 text-sm">메인 페이지로 이동합니다...</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default KakaoRedirectPage;
