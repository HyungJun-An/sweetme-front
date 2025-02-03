import { useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getKakaoAccessToken, getKakaoUserWithAccessToken } from '@/api/kakaoApi';
import useLoginStore from '@/stores/useLoginStore';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import useCustomLogin from '@/hooks/useCustomLogin';

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const login = useLoginStore((state) => state.login);
  const authCode = searchParams.get('code');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('인증 처리 중입니다...');
  const processedRef = useRef(false);
  const { moveToLogin } = useCustomLogin();

  useEffect(() => {
    const processLogin = async () => {
      try {
        if (processedRef.current) return;
        processedRef.current = true;

        const accessToken = await getKakaoAccessToken(authCode);

        setLoadingStatus('사용자 정보를 가져오는 중...');
        const userInfo = await getKakaoUserWithAccessToken(accessToken);

        login(userInfo);
        alert('로그인 되었습니다.');
        navigate({ pathname: '/' }, { replace: true });
      } catch (err) {
        if (err.response?.status === 409) {
          const { message, existingLoginType } = err.response.data;
          setError({
            type: 'SOCIAL_CONFLICT',
            message,
          });
        } else {
          setError({
            type: 'GENERAL',
            message: err.message || '로그인 처리 중 오류가 발생했습니다.',
          });
        }

        // 5초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          navigate({ pathname: '/' }, { replace: true });
        }, 5000);
      }
    };

    if (authCode) {
      processLogin();
    } else {
      setError({
        type: 'GENERAL',
        message: '인증 코드를 찾을 수 없습니다.',
      });
    }
  }, [authCode]);

  console.log('kakao redirect page');

  return (
    <div className="flex h-screen flex-col items-center p-4 pt-[20vh]">
      {!error ? (
        <div className="flex h-screen flex-col items-center p-4 pt-[20vh]">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <div className="text-lg font-medium">{loadingStatus}</div>
          <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
        </div>
      ) : error.type === 'SOCIAL_CONFLICT' ? (
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>다른 계정으로 가입된 사용자입니다</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error.message}</p>
            <Button className="mt-4 w-full" variant="outline" onClick={moveToLogin}>
              로그인 페이지로 돌아가기
            </Button>
          </AlertDescription>
        </Alert>
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
