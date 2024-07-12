import { useState, useEffect } from 'react';

import { useUserStore } from '@/providers/user';

import { createClient } from '../../../supabase/client';
import { getUserQuizzes } from '../queries-quizzes'; // 您需要创建这个函数
import { Quiz } from '../schema';

const supabase = createClient();

export function useRealtimeQuizzes() {
	const { user } = useUserStore((state) => state);

	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchAndSubscribe = async () => {
			if (user) {
				try {
					setIsLoading(true);
					const initialQuizzes = await getUserQuizzes(user.id);
					if (isMounted) {
						setQuizzes(initialQuizzes);
						setIsLoading(false);
					}

					console.log('useRealtimeQuizzes 开始加载和监听Quizzes');
					// 设置 Supabase 订阅
					const subscription = supabase
						.channel(`public:quizzes:user_id=eq.${user.id}`)
						.on(
							'postgres_changes',
							{
								event: '*',
								schema: 'public',
								table: 'quizzes',
								filter: `user_id=eq.${user.id}`,
							},
							(payload) => {
								if (isMounted) {
									switch (payload.eventType) {
										case 'INSERT':
											console.log('监听Quizzes: INSERT');
											setQuizzes((current) => [
												payload.new as Quiz,
												...current,
											]);
											break;
										case 'UPDATE':
											console.log('监听Quizzes: UPDATE');
											setQuizzes((current) => {
												const updatedQuiz =
													payload.new as Quiz;
												return current.map((quiz) =>
													quiz.id === updatedQuiz.id
														? updatedQuiz
														: quiz
												);
											});
											break;
										case 'DELETE':
											console.log('监听Quizzes: DELETE');
											setQuizzes((current) =>
												current.filter(
													(quiz) =>
														quiz.id !==
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
						setError('Failed to fetch or subscribe to quizzes');
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

	return { quizzes, isLoading, error };
}
