import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <article className="container mx-auto px-5">
        <div className="mx-auto max-w-[1100px]">
          {/* 헤더 영역 */}
          <header className="flex items-center justify-between py-[54px]">
            <Link to="/">
              <h1 className="text-2xl font-bold text-[#000638]">Header</h1>
            </Link>
            <nav>
              <ul className="flex gap-5 text-lg text-[#605C59]">
                <li>
                  <Link to="/write">Write</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
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
            <p className="text-[#3E3E3E]">© 2024 Sucoding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Layout;
