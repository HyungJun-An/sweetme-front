import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import MyPage from '@/pages/MyPage';
import Chat from '@/pages/Chat';
import Calendar from '@/pages/Calendar';
import Kanban from '@/pages/Kanban';
import BoardList from '@/pages/board/BoardList';
import BoardNew from '@/pages/board/BoardNew';
import Board from '@/pages/board/Board';
import BoardEdit from '../pages/board/BoardEdit';
import StudyNew from '@/pages/study/StudyNew';
import Study from '@/pages/study/Study';
import StudyEdit from '@/pages/study/StudyEdit';
import NotFound from '@/components/NotFound';
import KakaoRedirectPage from '@/pages/KakaoRedirectPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />, //홈 화면 (스터디 목록 포함)
      },
      {
        path: 'login', //로그인 화면
        children: [
          {
            path: '',
            element: <Login />,
          },
          {
            path: 'kakao',
            element: <KakaoRedirectPage />,
          },
        ],
      },
      {
        path: 'mypage',
        element: <MyPage />,
        children: [],
      },
      {
        path: 'profile/',
        children: [
          {
            path: 'me', // 내 프로필 조회 & 수정
            element: '',
          },
          {
            path: ':userId', //다른 사람 프로필 조회
            element: '',
          },
        ],
      },
      {
        path: 'studies/', // 스터디
        children: [
          {
            path: 'new', //새로운 스터디
            element: <StudyNew />,
          },
          {
            path: ':studyId', //스터디 상세
            element: <Study />,
          },
          {
            path: ':studyId/edit', //스터디 수정
            element: <StudyEdit />,
          },
        ],
      },
      {
        path: 'studies/:studyId/boards', //게시판
        children: [
          {
            path: '', //게시글 목록
            element: <BoardList />,
          },
          {
            path: 'new', //새로운 게시글
            element: <BoardNew />,
          },
          {
            path: ':boardId', //게시글 상세
            element: <Board />,
          },
          {
            path: ':boardId/edit', //게시글 수정
            element: <BoardEdit />,
          },
        ],
      },
      {
        path: 'studies/:studyId/tasks/calendar', //할일
        element: <Calendar />,
      },
      {
        path: 'studies/:studyId/tasks/kanban', //할일
        element: <Kanban />,
      },
      {
        path: 'studies/:studyId/chat', //채팅
        element: <Chat />,
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
export default router;
