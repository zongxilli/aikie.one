import { useState, useEffect } from 'react';

import { useUserStore } from '@/providers/user';

import { createClient } from '../../../supabase/client';
import { getUserChatSessions } from '../queries-chat';
import { ChatSession } from '../schema';

const supabase = createClient();

export function useRealtimeChatSessions() {
	const { user } = useUserStore((state) => state);

	const [sessions, setSessions] = useState<ChatSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchAndSubscribe = async () => {
			if (user) {
				try {
					setIsLoading(true);
					const initialSessions = await getUserChatSessions(user.id);
					if (isMounted) {
						setSessions(initialSessions);
						setIsLoading(false);
					}

					console.log(
						'useRealtimeChatSessions 开始加载和监听Sessions'
					);
					// 设置 Supabase 订阅
					const subscription = supabase
						.channel(`public:chat_sessions:user_id=eq.${user.id}`)
						.on(
							'postgres_changes',
							{
								event: '*',
								schema: 'public',
								table: 'chat_sessions',
								filter: `user_id=eq.${user.id}`,
							},
							(payload) => {
								if (isMounted) {
									switch (payload.eventType) {
										case 'INSERT':
											console.log('监听Sessions: INSERT');
											setSessions((current) => [
												payload.new as ChatSession,
												...current,
											]);
											break;
										case 'UPDATE':
											console.log('监听Sessions: UPDATE');
											setSessions((current) =>
												current.map((session) =>
													session.id ===
													payload.new.id
														? {
																...session,
																...payload.new,
														  }
														: session
												)
											);
											break;
										case 'DELETE':
											console.log('监听Sessions: DELETE');
											setSessions((current) =>
												current.filter(
													(session) =>
														session.id !==
														payload.old.id
												)
											);
											break;
									}
								}
							}
						)
						.subscribe();

					// 清理函数
					return () => {
						isMounted = false;
						supabase.removeChannel(subscription);
					};
				} catch (error) {
					console.error('Error in fetchAndSubscribe:', error);
					if (isMounted) {
						setError(
							'Failed to fetch or subscribe to chat sessions'
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
	}, [user]);

	return { sessions, isLoading, error };
}
