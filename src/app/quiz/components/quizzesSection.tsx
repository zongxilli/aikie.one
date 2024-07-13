import React, { Dispatch, Fragment, SetStateAction } from 'react';

import { LoadingOverlay } from '@/components/shared';
import { Quiz } from '@/db/schema';

import QuizCard from './quizCard';

type Props = {
	quizzes: Quiz[];
	isQuizzesLoading: boolean;
	selectedQuiz: Quiz | null;
	setSelectedQuiz: Dispatch<SetStateAction<Quiz | null>>;
};

const QuizzesSection = ({
	quizzes,
	isQuizzesLoading,
	selectedQuiz,
	setSelectedQuiz,
}: Props) => {
	const renderQuizzes = () => {
		if (isQuizzesLoading) {
			return <LoadingOverlay label='Loading quizzes...' />;
		}

		const handleSelectQuiz = (quiz: Quiz) => {
			setSelectedQuiz((prevQuiz) =>
				prevQuiz?.id === quiz.id ? null : quiz
			);
		};

		return (
			<div className='w-full h-[calc(100dvh_-_12rem)] grid grid-cols-card-auto-fill-minmax gap-6 overflow-auto'>
				{quizzes.map((quiz) => (
					<Fragment key={quiz.id}>
						<QuizCard
							quiz={quiz}
							selectedQuiz={selectedQuiz}
							onClick={() => handleSelectQuiz(quiz)}
						/>
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
