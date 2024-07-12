import React, { Fragment } from 'react';

import { LoadingOverlay } from '@/components/shared';
import { useRealtimeQuizzes } from '@/db/supabase-subscriptions/useRealtimeQuizzes';

import QuizCard from './quizCard';

const QuizzesSection = () => {
	const {
		quizzes,
		isLoading: isQuizzesLoading,
		error,
	} = useRealtimeQuizzes();

	const renderQuizzes = () => {
		if (isQuizzesLoading)
			return <LoadingOverlay label='Loading quizzes...' />;

		return (
			<div className='w-full h-[calc(100dvh_-_12rem)] grid grid-cols-card-auto-fill-minmax gap-6 overflow-auto'>
				{quizzes.map((quiz) => (
					<Fragment key={quiz.id}>
						<QuizCard quiz={quiz} />
					</Fragment>
				))}
			</div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border relative flex flex-col items-center justify-start'>
			{renderQuizzes()}
		</div>
	);
};

export default QuizzesSection;
