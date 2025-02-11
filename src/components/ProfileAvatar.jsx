import { memo } from 'react';
import { getImageUrl } from '@/api/profileApi';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const ProfileAvatar = memo(({ imagePath, nickname }) => {
  const imageUrl = imagePath ? (imagePath.startsWith('blob:') ? imagePath : getImageUrl(imagePath)) : undefined;

  return (
    <Avatar className="h-24 w-24">
      <AvatarImage src={imageUrl} alt={nickname} crossOrigin="anonymous" />
      <AvatarFallback>{nickname?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
});

export default ProfileAvatar;
