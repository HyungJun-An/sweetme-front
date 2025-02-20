import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLoginStore from '@/stores/useLoginStore.jsx';
import {getOtherProfile} from "@/api/profileApi.js";
import ProfileAvatar from "@/components/ProfileAvatar.jsx";

const Chat = () => {
	const userId = useLoginStore((state) => state.id);
	const nickname = useLoginStore((state) => state.nickname);
	const { studyId } = useParams();
	const ws = useRef(null);
	const connectAttempted = useRef(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [page, setPage] = useState(0);
	const scrollRef = useRef(null);
	const [hasMore, setHasMore] = useState(true);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [userProfiles, setUserProfiles] = useState({});

	useEffect(() => {
		const fetchUserProfiles = async () => {
			try {
				// 1️⃣ 유저 ID 및 프로필 ID 리스트 조회
				const response = await fetch(`http://localhost:8080/studies/${studyId}/chat/member`);
				const usersData = await response.json(); // [{ userId: 1, profileId: 10 }, { userId: 2, profileId: 20 }, ...]

				if (!usersData.length) {
					console.log("프로필 조회 시 에러 발생!");
					return;
				}

				// 2️⃣ 각 프로필 정보를 조회
				const profilePromises = usersData.map(({ profileId }) => getOtherProfile(profileId));
				const profilesData = await Promise.all(profilePromises);

				// 3️⃣ userId를 키로 한 객체 생성
				const profiles = {};
				usersData.forEach(({ userId, profileId }, index) => {
					profiles[userId] = { profileId, ...profilesData[index] }; // userId 기준으로 프로필 저장
				});

				// 4️⃣ 상태 업데이트
				setUserProfiles(profiles);

				console.log("✅ 유저 프로필 정보 저장 완료:", profiles);
			} catch (error) {
				console.error("❌ Failed to fetch user profiles:", error);
			}
		};
		fetchUserProfiles();
	}, [studyId]);

	useEffect(() => {
		console.log("📌 업데이트된 userProfiles:", userProfiles);
	}, [userProfiles]);



	// 메시지 불러오기
	const fetchMessages = async (pageNum) => {
		try {
			const size = 10;
			const response = await fetch(
				`http://localhost:8080/studies/${studyId}/chat?page=${pageNum}&size=${size}`
			);
			const chatData = await response.json();
			if (chatData.content.length === 0) {
				setHasMore(false);
				return;
			}

			setMessages((prev) => {
				const allMessages = [...prev];
				chatData.content.forEach((newMsg) => {
					if (
						!allMessages.some(
							(existingMsg) =>
								existingMsg.createdAt === newMsg.createdAt && existingMsg.message === newMsg.message
						)
					) {
						allMessages.push(newMsg);
					}
				});

				const sortedMessages = allMessages.sort(
					(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);

				if (pageNum === 0) {
					setInitialLoadComplete(true);
				}

				return sortedMessages;
			});
		} catch (error) {
			console.error('채팅 내역 로딩 실패:', error);
		}
	};

	useEffect(() => {
		if (initialLoadComplete && scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [initialLoadComplete]);

	useEffect(() => {
		if (connectAttempted.current) return;
		connectAttempted.current = true;

		ws.current = new WebSocket(`ws://localhost:8080/ws/studies/${studyId}/chat`);

		ws.current.onopen = () => {
			console.log('WebSocket Connected');
		};

		ws.current.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages, receivedMessage];
				requestAnimationFrame(() => {
					scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
				});
				return newMessages;
			});
		};

		ws.current.onclose = () => {
			console.log('WebSocket Disconnected');
		};

		ws.current.onerror = (error) => {
			console.error('WebSocket Error:', error);
		};

		fetchMessages(0);

		return () => {
			if (ws.current?.readyState === WebSocket.OPEN) {
				ws.current.close();
			}
		};
	}, [studyId]);

	const handleScroll = async (e) => {
		const { scrollTop } = e.target;
		if (scrollTop === 0 && hasMore) {
			const prevHeight = scrollRef.current.scrollHeight;

			setPage((prev) => {
				const nextPage = prev + 1;
				fetchMessages(nextPage).then(() => {
					requestAnimationFrame(() => {
						const newHeight = scrollRef.current.scrollHeight;
						scrollRef.current.scrollTop = newHeight - prevHeight;
					});
				});
				return nextPage;
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!message.trim() || !ws.current) return;

		const messageData = {
			studyId: studyId,
			userId: userId,
			nickname: nickname,
			message: message,
			createdAt: new Date().toISOString(),
		};

		ws.current.send(JSON.stringify(messageData));
		setMessage('');
	};

	const formatTime = (timeString) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};


	return (
		<div className="flex h-screen flex-col bg-gray-100">
			<div className="flex items-center bg-white p-4 shadow-sm">
				<h1 className="text-xl font-semibold">스터디 채팅방 {studyId}</h1>
			</div>

			<div ref={scrollRef} onScroll={handleScroll} className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((msg, index) => (
					<div key={index} className={`flex items-end ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}>
						{msg.userId !== userId && (
							<ProfileAvatar imagePath={userProfiles[msg.userId]?.imagePath} nickname={msg.nickname}/>
						)}

						<div className={`max-w-[70%] rounded-lg p-3 ${msg.userId === userId ? 'rounded-br-none bg-blue-500 text-white' : 'rounded-bl-none bg-white text-gray-800'}`}>
							{msg.userId !== userId && <div className="text-sm font-semibold mb-1">{msg.nickname}</div>}
							<p className="break-words">{msg.message}</p>
							<div className={`text-xs mt-1 ${msg.userId === userId ? 'text-blue-100' : 'text-gray-500'}`}>
								{msg.createdAt && formatTime(msg.createdAt)}
							</div>
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit} className="border-t bg-white p-4">
				<div className="flex space-x-2">
					<input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="메시지를 입력하세요..." className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
					<button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none">전송</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;
