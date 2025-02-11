import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, BookOpen, MessageSquare, Heart, UserPlus, ChevronDown, Settings } from 'lucide-react';
import useProfileStore from '@/stores/useProfileStore';
import { useEffect } from 'react';
import { getImageUrl } from '@/api/profileApi';

const SidebarNavItem = ({ icon: Icon, title, href, isActive }) => {
  return (
    <Button variant="ghost" className={`w-full justify-start gap-2 font-normal ${isActive ? 'bg-muted' : ''}`} asChild>
      <a href={href}>
        <Icon className="h-4 w-4" />
        {title}
      </a>
    </Button>
  );
};

const MyPageLayout = ({ children, currentPath = '' }) => {
  // useProfileStore 에서 profile 가져오기
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const imageUrl = profile.imagePath
    ? profile.imagePath.startsWith('blob:')
      ? profile.imagePath
      : getImageUrl(profile.imagePath)
    : undefined;

  // 컴포넌트 마운트 시 프로필 데이터 가져오기
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const sidebarNavItems = [
    {
      title: '내 프로필',
      icon: User,
      href: '/mypage/profile',
    },
    {
      title: '내 스터디',
      icon: BookOpen,
      href: '/mypage/studies',
    },
    {
      title: '내 게시글/댓글',
      icon: MessageSquare,
      href: '/mypage/posts',
    },
    {
      title: '좋아요 누른 글',
      icon: Heart,
      href: '/mypage/likes',
    },
    {
      title: '스터디 요청 목록',
      icon: UserPlus,
      href: '/mypage/requests',
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="flex h-full flex-col p-4">
          {/* User Profile Section */}
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={imageUrl} alt={profile.simpleUser.nickname} />
                  <AvatarFallback>{profile.simpleUser.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{profile.simpleUser.nickname}</div>
                  <div className="text-sm text-muted-foreground">{profile.simpleUser.email}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 pt-4">
            {sidebarNavItems.map((item, index) => (
              <SidebarNavItem
                key={index}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isActive={currentPath === item.href}
              />
            ))}
          </nav>

          {/* Settings Button */}
          <div className="border-t pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              설정
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default MyPageLayout;
