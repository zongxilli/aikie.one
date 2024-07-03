import { useState, useEffect } from 'react';

import { createClient } from '../../../supabase/client';
import { getSessionMessages } from '../queries-chat-messages';
import { Message } from '../schema';

const supabase = createClient();

export function useRealtimeChatMessages(sessionId: string | null) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchAndSubscribe = async () => {
			if (sessionId) {
				try {
					setIsLoading(true);
					const initialMessages = await getSessionMessages(sessionId);
					if (isMounted) {
						setMessages(initialMessages);
						setIsLoading(false);
					}

					console.log(
						'useRealtimeChatMessages 开始加载和监听Messages'
					);
					const subscription = supabase
						.channel(`public:messages:session_id=eq.${sessionId}`)
						.on(
							'postgres_changes',
							{
								event: '*',
								schema: 'public',
								table: 'messages',
								filter: `session_id=eq.${sessionId}`,
							},
							(payload) => {
								if (isMounted) {
									switch (payload.eventType) {
										case 'INSERT':
											console.log('监听Messages: INSERT');
											setMessages((current) => [
												...current,
												payload.new as Message,
											]);
											break;
										case 'UPDATE':
											console.log('监听Messages: UPDATE');
											setMessages((current) =>
												current.map((message) =>
													message.id ===
													payload.new.id
														? {
																...message,
																...payload.new,
														  }
														: message
												)
											);
											break;
										case 'DELETE':
											console.log('监听Messages: DELETE');
											setMessages((current) =>
												current.filter(
													(message) =>
														message.id !==
														payload.old.id
												)
											);
											break;
									}
								}
							}
						)
						.subscribe();

					return () => {
						isMounted = false;
						supabase.removeChannel(subscription);
					};
				} catch (error) {
					console.error('Error in fetchAndSubscribe:', error);
					if (isMounted) {
						setError(
							'Failed to fetch or subscribe to chat messages'
						);
						setIsLoading(false);
					}
				}
			}
		};

		fetchAndSubscribe();

		return () => {
			isMounted = false;
		};
	}, [sessionId]);

	// 添加一个辅助函数来按角色过滤消息
	const getMessagesByRole = (role: string) => {
		return messages.filter((message) => message.role === role);
	};

	if (sessionId === null)
		return {
			messages: [],
			isLoading: false,
			error: null,
			userMessages: [],
			assistantMessages: [],
		};

	return {
		messages,
		isLoading,
		error,
		userMessages: getMessagesByRole('user'), // 新增：用户消息
		assistantMessages: getMessagesByRole('assistant'), // 新增：AI助手消息
	};
}
