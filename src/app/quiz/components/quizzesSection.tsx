import React, {
	Dispatch,
	Fragment,
	SetStateAction,
	useMemo,
	useState,
} from 'react';

import { LoadingOverlay, SearchBar } from '@/components/shared';
import { Quiz } from '@/db/schema';
import { useDebouncedState } from '@/hooks';

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
	const [searchQuery, setSearchQuery] = useState('');

	const debouncedSearchQuery = useDebouncedState(searchQuery);

	const filteredQuizzes = useMemo(() => {
		if (debouncedSearchQuery === '') return quizzes;

		return quizzes.filter((quiz) =>
			quiz.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
		);
	}, [quizzes, debouncedSearchQuery]);

	const renderSearchBar = () => {
		return (
			<div className='w-full h-[5rem] flex-shrink-0 flex items-center justify-center'>
				<SearchBar setSearchQuery={setSearchQuery} />
			</div>
		);
	};

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
			<div className='w-full flex-grow overflow-auto'>
				<div className='grid grid-cols-card-auto-fill-minmax gap-3 '>
					{filteredQuizzes.map((quiz) => (
						<Fragment key={quiz.id}>
							<QuizCard
								quiz={quiz}
								selected={selectedQuiz?.id === quiz.id}
								onClick={() => handleSelectQuiz(quiz)}
							/>
						</Fragment>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className='w-full h-full outline p-4 box-border relative flex flex-col items-center gap-2'>
			{renderSearchBar()}
			{renderQuizzes()}
		</div>
	);
};

export default QuizzesSection;
