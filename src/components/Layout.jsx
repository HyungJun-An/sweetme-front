import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmojiHappy } from 'iconsax-react';
import useLoginStore from '@/stores/useLoginStore';
import useCustomLogin from '@/hooks/useCustomLogin';

const Layout = () => {
  const email = useLoginStore((state) => state.email);
  const logout = useLoginStore((state) => state.logout);
  const { moveToPath } = useCustomLogin();
  const handleClickLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    moveToPath('/');
  };

  return (
    <>
      <article className="container mx-auto px-5">
        <div className="mx-auto max-w-[1100px]">
          {/* 헤더 영역 */}
          <header className="flex items-center justify-between py-[54px]">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#000638]">
                <EmojiHappy className="inline-block" /> Sweet Me
              </h1>
            </Link>
            <nav>
              <ul className="flex gap-5 text-lg text-[#605C59]">
                {!email ? (
                  <li>
                    <Link to="/login">
                      <Button>로그인</Button>
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Button variant="ghost" onClick={handleClickLogout}>
                        로그아웃
                      </Button>
                    </li>
                    <li>
                      <Link to="/mypage">
                        <Button variant="ghost">마이페이지</Button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </header>
          <main className="min-h-[calc(100vh)]">
            <Outlet />
          </main>
        </div>
      </article>
      <footer className="bg-[#F5F5F5] py-[36px]">
        <div className="container mx-auto flex flex-col items-center justify-end">
          <nav className="mb-[26px] flex gap-[25px] text-sm text-[#544B44]">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </nav>
          <div>
            <p className="text-[#3E3E3E]">© All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Layout;
