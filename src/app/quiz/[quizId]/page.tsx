'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { getQuizById } from '@/db/queries-quizzes';
import { Quiz } from '@/db/schema';

export default function QuizPage() {
	const { quizId } = useParams();

	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadQuiz = async () => {
			setIsLoading(true);
			try {
				if (typeof quizId !== 'string') {
					throw new Error('Invalid quiz ID');
				}
				const fetchedQuiz = await getQuizById(quizId);
				setQuiz(fetchedQuiz);
			} finally {
				setIsLoading(false);
			}
		};

		loadQuiz();
	}, [quizId]);

	return (
		<div className='w-full h-full p-4 box-border'>
			<div className='w-full p-4 border rounded-lg bg-card min-w-[30rem] h-[calc(100dvh_-_6rem)]'>
				{isLoading && 'is loading...'}
				{JSON.stringify(quiz)}
			</div>
		</div>
	);
}
