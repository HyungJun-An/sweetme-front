import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { getImageUrl, getMyProfile } from '@/api/profileApi';
import useProfileStore from '@/stores/useProfileStore';
import { Link } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';

const Profile = () => {
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-1">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <ProfileAvatar imagePath={profile.imagePath} nickname={profile.simpleUser.nickname} />
              <div className="flex flex-col items-start">
                <CardTitle className="text-2xl">{profile.simpleUser.nickname}</CardTitle>
                {profile.simplePositions.length > 0 && (
                  <Badge variant="secondary" className="mt-2 text-sm">
                    {profile.simplePositions[0].name}
                  </Badge>
                )}
                {profile.profileUrl && (
                  <Button variant="ghost" className="mt-2 h-8 px-0" asChild>
                    <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      <span className="text-sm">{profile.profileUrl}</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <Link to={'/mypage/profile/edit'}>
              <Button variant="outline">프로필 수정</Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">자기소개</h3>
            <p className="text-muted-foreground">{profile.description}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">기술 스택</h3>
            <div className="flex flex-wrap gap-3">
              {profile.simpleStacks.map((stack) => (
                <div key={stack.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={stack.logoURL} alt={stack.name} />
                    <AvatarFallback>{stack.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{stack.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
