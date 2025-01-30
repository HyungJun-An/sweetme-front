import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getKakaoLoginLink } from '@/api/kakaoApi';
import { Link } from 'react-router-dom';

export function LoginForm({ className, ...props }) {
  const link = getKakaoLoginLink();

  return (
    <div className="mt-[calc(33vh-12rem)] flex min-h-screen justify-center bg-background p-8">
      <div className="w-full max-w-[364px]">
        <Card className="mb-6">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-xl font-medium">환영합니다</CardTitle>
            <CardDescription>카카오나 네이버 계정으로 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Link to={link}>
                <Button
                  variant="outline"
                  className="h-12 w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90 hover:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-5 w-5">
                    <path
                      d="M12 2.276c-6.627 0-12 4.4-12 9.83 0 3.412 2.248 6.41 5.625 8.112l-1.438 5.257a.75.75 0 001.149.773l6.24-4.202a13.214 13.214 0 00.424.003c6.627 0 12-4.4 12-9.83s-5.373-9.944-12-9.944z"
                      fill="currentColor"
                    />
                  </svg>
                  카카오로 로그인
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-12 w-full bg-[#03C75A] text-white hover:bg-[#03C75A]/90 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="mr-2 h-5 w-5">
                  <path d="M15.792 11.111L9.277 2H4v20h5.732V11.784L16.8 22h5.2V2h-6.208v9.111z" fill="currentColor" />
                </svg>
                네이버로 로그인
              </Button>
              <div className="text-center">
                <span className="text-sm">
                  계정이 없으신가요?{' '}
                  <a href="#" className="text-primary underline-offset-4 hover:underline">
                    회원가입
                  </a>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center text-xs text-muted-foreground">
          계속하기를 클릭하면{' '}
          <a href="#" className="underline-offset-4 hover:underline">
            서비스 이용약관
          </a>
          과{' '}
          <a href="#" className="underline-offset-4 hover:underline">
            개인정보 처리방침
          </a>
          에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}
