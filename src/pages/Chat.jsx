import React, {useState, useRef, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const Chat = () => {
	// const { user } = useContext(AuthContext);
	const { studyId } = useParams();
	const ws = useRef(null);
	const connectAttempted = useRef(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [page, setPage] = useState(0);
	const scrollRef = useRef(null);
	const [hasMore, setHasMore] = useState(true);

	// 초기 메시지 로드 완료 상태를 추적하기 위한 state 추가
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);

	// fetchMessages 함수 수정
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

			setMessages(prev => {
				const allMessages = [...prev];
				chatData.content.forEach(newMsg => {
					if (!allMessages.some(existingMsg =>
						existingMsg.createdAt === newMsg.createdAt &&
						existingMsg.message === newMsg.message
					)) {
						allMessages.push(newMsg);
					}
				});
				const sortedMessages = allMessages.sort((a, b) => {
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				});

				// pageNum이 0일 때(초기 로드)만 initialLoadComplete를 true로 설정
				if (pageNum === 0) {
					setInitialLoadComplete(true);
				}

				return sortedMessages;
			});
		} catch (error) {
			console.error('채팅 내역 로딩 실패:', error);
		}
	};

// 초기 로드 완료 시 스크롤을 맨 아래로 이동
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
			setMessages(prevMessages => {
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
			// 이전 높이 저장
			const prevHeight = scrollRef.current.scrollHeight;

			setPage(prev => {
				const nextPage = prev + 1;
				fetchMessages(nextPage).then(() => {
					// DOM 업데이트 후에 스크롤 위치 조정
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
			userId: 1, //user.id 추후에 Spring Security를 통해서 유저 아이디를 조회 하여 가져와야 함
			nickname: "nickname", // user.nickname
			message: message,
			createdAt: new Date().toISOString()
		};

		ws.current.send(JSON.stringify(messageData));
		setMessages(prevMessages => {
			const newMessages = [...prevMessages, messageData];
			requestAnimationFrame(() => {
				scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
			});
			return newMessages;
		});
		setMessage('');
	};

	const formatTime = (timeString) => {
		const date = new Date(timeString);
		return date.toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div className="flex h-screen flex-col bg-gray-100">
			<div className="flex items-center bg-white p-4 shadow-sm">
				<h1 className="text-xl font-semibold">스터디 채팅방 {studyId}</h1>
			</div>

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex-1 space-y-4 overflow-y-auto p-4"
			>
				{messages.map((msg, index) => (
					<div key={index} className={`flex ${msg.userId === 1 ? 'justify-end' : 'justify-start'}`}>
						<div
							className={`max-w-[70%] rounded-lg p-3 ${
								msg.userId === 1 ? 'rounded-br-none bg-blue-500 text-white' : 'rounded-bl-none bg-white text-gray-800'
							}`}
						>
							{msg.userId !== 1 && (
								<div className="text-sm font-semibold mb-1">
									{msg.nickname}
								</div>
							)}
							<p className="break-words">{msg.message}</p>
							<div className={`text-xs mt-1 ${msg.userId === 1 ? 'text-blue-100' : 'text-gray-500'}`}>
								{msg.createdAt && formatTime(msg.createdAt)}
							</div>
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit} className="border-t bg-white p-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="메시지를 입력하세요..."
						className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					/>
					<button
						type="submit"
						className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
					>
						전송
					</button>
				</div>
			</form>
		</div>
	);
};

export default Chat;
