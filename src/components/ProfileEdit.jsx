import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from './ui/select';
import { Upload } from 'lucide-react';
import useProfileStore from '@/stores/useProfileStore';
import { getImageUrl, getProfileOptions, updateMyProfile } from '@/api/profileApi';
import StackSelector from './StackSelector';
import ProfileAvatar from './ProfileAvatar';

const ProfileEdit = () => {
  const [selectedImage, setSelectedImage] = useState(null); // 새로 선택된 이미지 파일을 저장할 state 추가
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MIN_DIMENSION = 320; // 최소 320*320
  const MAX_DIMENSION = 2048; // 최대 2048*2048
  const RECOMMENDED_DIMENSION = 500; // 권장 500*500
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({ positions: [], stacks: [] });
  const [formData, setFormData] = useState({
    id: null,
    description: '',
    imagePath: '',
    profileUrl: '',
    simplePositions: [{ id: '', name: '' }],
    simpleStacks: [{ id: '', name: '', logoURL: '' }],
    simpleUser: {
      email: '',
      id: null,
      nickname: '',
    },
  });

  // 프로필 옵션 데이터 fetch
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const res = await getProfileOptions();
        console.log('API Response: ', res);
        setOptions({
          positions: res.simplePositions,
          stacks: res.simpleStacks,
        });
      } catch (error) {
        console.error('Failed to fetch profile options: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        description: profile.description,
        imagePath: profile.imagePath,
        profileUrl: profile.profileUrl,
        simplePositions: profile.simplePositions,
        simpleStacks: profile.simpleStacks,
        simpleUser: {
          email: profile.simpleUser.email,
          id: profile.simpleUser.id,
          nickname: profile.simpleUser.nickname,
        },
      });
    }
  }, [profile]);

  const handlePositionChange = (positionId) => {
    if (positionId === 'default') {
      // 기본 옵션 선택 시 빈 배열로 설정
      setFormData((prev) => ({
        ...prev,
        simplePositions: [],
      }));
      return;
    }

    const selectedPosition = options.positions?.find((p) => p.id?.toString() === positionId);
    if (!selectedPosition) return;
    setFormData((prev) => ({
      ...prev,
      simplePositions: [{ id: selectedPosition.id?.toString(), name: selectedPosition.name }],
    }));
  };

  const toggleStack = (stackId) => {
    const selectedStack = options.stacks.find((s) => s.id === stackId);
    setFormData((prev) => {
      // 배열의 요소들 중 하나라도 조건을 만족하면 true
      const stackExists = prev.simpleStacks.some((s) => s.id === stackId);
      const newStacks = stackExists
        ? prev.simpleStacks.filter((s) => s.id !== stackId) // 조건을 만족하는 모든 요소들로 이루어진 새로운 배열 반환
        : [...prev.simpleStacks, { id: selectedStack.id, name: selectedStack.name, logoURL: selectedStack.logoURL }];

      return {
        ...prev,
        simpleStacks: newStacks,
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검사
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }

    // 파일 타입 검사
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('JPG, PGN, GIF 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    // 이미지 크기 검사
    const img = new Image();
    img.src = URL.createObjectURL(file); // 미리보기를 위한 URL 생성
    img.onload = () => {
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        alert(`이미지 크기는 최소 ${MIN_DIMENSION}x${MIN_DIMENSION} 픽셀이어야 합니다.`);
        e.target.value = '';
        URL.revokeObjectURL(img.src);
        return;
      }
      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        alert(`이미지 크기는 최대 ${MAX_DIMENSION}x${MAX_DIMENSION} 픽셀을 초과할 수 없습니다.`);
        e.target.value = '';
        URL.revokeObjectURL(img.src);
        return;
      }
    };

    setSelectedImage(file);
    setFormData((prev) => ({
      ...prev,
      imagePath: img.src,
    }));

    img.onerror = () => {
      alert('이미지 파일을 읽는 중 오류가 발생했습니다.');
      e.target.value = '';
      URL.revokeObjectURL(img.src);
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nickname' || name === 'email') {
      setFormData((prev) => ({
        ...prev,
        simpleUser: {
          ...prev.simpleUser,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // 기존 profileData 형식 그대로 유지
      const profileData = {
        id: formData.id,
        description: formData.description,
        imagePath: formData.imagePath,
        profileUrl: formData.profileUrl,
        simplePositions: formData.simplePositions,
        simpleStacks: formData.simpleStacks,
        simpleUser: formData.simpleUser,
      };

      console.log('profileData: ', profileData);

      // 새로운 이미지가 선택된 경우에만 이미지 파일 추가
      if (selectedImage) {
        await updateMyProfile(profileData, selectedImage);
      } else {
        await updateMyProfile(profileData);
      }

      alert('프로필이 정상적으로 수정되었습니다.');
      navigate('/mypage/profile');
    } catch (error) {
      console.error('Failed to update profile: ', error);
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mypage/profile');
  };

  return (
    <div className="container mx-auto py-1">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>프로필 수정</CardTitle>
          {/* <p className="pt-2 text-sm text-muted-foreground">다른 사용자들에게 보여질 프로필 정보입니다.</p> */}
          <div className="mt-4 flex items-center gap-6 pt-10">
            <ProfileAvatar imagePath={formData.imagePath} nickname={profile.simpleUser.nickname} />
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">프로필 이미지를 변경하려면 아래 버튼을 클릭하세요</div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => document.getElementById('imageUpload').click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  이미지 업로드
                </Button>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                • 권장 크기: 500x500 px
                <br />• 최소 크기: 320x320 px
                <br />• 최대 크기: 2048x2048 px
                <br />• 최대 용량: 5MB
                <br />• 지원 형식: JPG, PNG, GIF
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                value={formData.simpleUser.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
              />
              <p className="text-sm text-muted-foreground">나의 닉네임을 정해주세요.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                value={formData.simpleUser.email}
                onChange={handleChange}
                type="email"
                disabled
              />
              <p className="text-sm text-muted-foreground">이메일은 수정할 수 없습니다.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">자기소개</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="자기소개를 입력하세요"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">나를 소개해주세요.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileUrl">웹사이트</Label>
              <Input
                id="profileUrl"
                name="profileUrl"
                value={formData.profileUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                type="url"
              />
              <p className="text-sm text-muted-foreground">블로그, 포트폴리오 등 웹사이트 URL을 입력하세요.</p>
            </div>

            {/* 포지션 선택 */}
            <div className="space-y-2">
              <Label>직무 선택</Label>
              <Select
                defaultValue="default"
                value={formData.simplePositions?.[0]?.id?.toString() || 'default'}
                onValueChange={handlePositionChange}
              >
                <SelectTrigger className="w-full" disabled={isLoading}>
                  <SelectValue placeholder={isLoading ? '로딩 중...' : '직무를 선택하세요'}>
                    {formData.simplePositions?.[0]?.name || ''}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">직무를 선택하세요</SelectItem>
                  {options.positions?.map((position) => (
                    <SelectItem key={position.id} value={position.id?.toString() || ''}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 스택 선택 */}
            <div className="space-y-2">
              <Label>기술 스택</Label>
              <StackSelector
                options={options}
                selectedStacks={formData.simpleStacks}
                onStackToggle={toggleStack}
                isLoading={isLoading}
              ></StackSelector>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button type="submit">저장하기</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit;
