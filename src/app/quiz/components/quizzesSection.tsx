import React, {
	Dispatch,
	Fragment,
	SetStateAction,
	useMemo,
	useState,
} from 'react';

import { ArrowDownUp, ArrowUpDown } from 'lucide-react';

import { LoadingOverlay, SearchBar } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Quiz } from '@/db/schema';
import { useDebouncedState } from '@/hooks';

import QuizCard from './quizCard';
import { useRouter } from 'next/navigation';

enum SortDirection {
	asc,
	desc,
}

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
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState('');
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		SortDirection.asc
	);

	const debouncedSearchQuery = useDebouncedState(searchQuery);

	const filteredQuizzes = useMemo(() => {
		const sortedQuizzes = quizzes.sort((a, b) => {
			const dateA = new Date(a.created_at).getTime();
			const dateB = new Date(b.created_at).getTime();
			return sortDirection === SortDirection.desc
				? dateA - dateB
				: dateB - dateA;
		});

		if (debouncedSearchQuery === '') return sortedQuizzes;

		return sortedQuizzes.filter((quiz) =>
			quiz.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
		);
	}, [quizzes, debouncedSearchQuery, sortDirection]);

	const renderSearchBar = () => {
		const handleSortDirectionChange = () => {
			setSortDirection((state) =>
				state === SortDirection.asc
					? SortDirection.desc
					: SortDirection.asc
			);
		};

		const DirectionIcon =
			sortDirection === SortDirection.asc ? ArrowUpDown : ArrowDownUp;

		return (
			<div className='w-full h-[5rem] flex-shrink-0 flex items-center justify-center gap-4'>
				<SearchBar value={searchQuery} setValue={setSearchQuery} />

				<Button
					variant='config'
					size='config'
					onClick={handleSortDirectionChange}
				>
					<p className='text-sm'>Date created</p>
					<DirectionIcon className='w-4 h-4 ml-2' />
				</Button>
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
								onDoubleClick={() =>
									router.push(`/quiz/${quiz.id}`)
								}
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
