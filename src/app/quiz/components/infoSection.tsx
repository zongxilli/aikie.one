import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Quiz } from '@/db/schema';
import { useUserStore } from '@/providers/user';

import GenerateQuizModal from './generateQuizModal';
import QuizSummary from './quizSummary';

type Props = {
	quizzes: Quiz[];
	isQuizzesLoading: boolean;
	selectedQuiz: Quiz | null;
	setSelectedQuiz: Dispatch<SetStateAction<Quiz | null>>;
};

const InfoSection = ({
	quizzes,
	isQuizzesLoading,
	selectedQuiz,
	setSelectedQuiz,
}: Props) => {
	const { user, isLoading, error } = useUserStore((state) => state);
	const summarySectionRef = useRef<HTMLDivElement>(null);

	const [showGenerateQuizModal, setShowGenerateQuizModal] = useState(false);

	useEffect(() => {
		if (selectedQuiz && summarySectionRef.current) {
			summarySectionRef.current.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	}, [selectedQuiz]);

	const renderSectionHeader = () => {
		return (
			<div className='w-full flex items-center justify-between'>
				<div>Summary</div>
				<Button
					className=''
					onClick={() => setShowGenerateQuizModal(true)}
				>
					Generate new quiz
					<Plus className='h-4 w-4 ml-2' />
				</Button>
			</div>
		);
	};

	const renderGenerateQuizModal = () => (
		<GenerateQuizModal
			isModalOpen={showGenerateQuizModal}
			setIsModalOpen={setShowGenerateQuizModal}
			setSelectedQuiz={setSelectedQuiz}
		/>
	);

	const renderQuizSummary = () => {
		return (
			<div
				className='flex-grow p-6 min-h-0 overflow-scroll'
				ref={summarySectionRef}
			>
				<QuizSummary selectedQuiz={selectedQuiz} />
			</div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border flex flex-col gap-4'>
			{renderSectionHeader()}
			{renderQuizSummary()}
			{renderGenerateQuizModal()}
		</div>
	);
};

export default InfoSection;
