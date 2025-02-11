import { create } from 'zustand';
import { getMyProfile } from '@/api/profileApi';

const initialProfile = {
  id: null,
  simpleUser: {
    id: null,
    email: '',
    nickname: '',
  },
  description: '',
  profileUrl: '',
  imagePath: '',
  simpleStacks: [],
  simplePositions: [],
};

const useProfileStore = create((set) => ({
  profile: initialProfile,
  fetchProfile: async () => {
    const data = await getMyProfile();
    set({ profile: data });
  },
  updateProfile: (newProfile) => set({ profile: newProfile }),
  resetProfile: () => set({ profile: initialProfile }),
}));

export default useProfileStore;
