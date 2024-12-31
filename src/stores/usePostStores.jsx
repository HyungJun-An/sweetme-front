import { create } from "zustand";
import { api } from "@/api/api";

//store 예시
export const usePostStore = create((set) => ({
	posts: null, // 여러개 게시물
	post: null, // 단일 게시물
	fetchPosts: async (url) => {
		// posts?id_ne=1
		// posts
		const data = await api(url !== undefined ? url : "posts");
		set({ posts: data });
	},
	fetchPostsOne: async (id) => {
		const data = await api(`posts/${id}`);
		set({ post: data });
	},
	addPosts: async (formData) => {
		const data = await api("posts", {
			method: "POST",
			body: JSON.stringify(formData),
		});
		return data;
	},
}));
