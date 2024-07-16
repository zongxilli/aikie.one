import { Dispatch, SetStateAction, useState } from 'react';

import { FileUpload, Modal } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Quiz } from '@/db/schema';
import { useUserStore } from '@/providers/user';

import GeneratedQuestions from './tooltips/generateQuestions';

type Props = {
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedQuiz: Dispatch<SetStateAction<Quiz | null>>;
};

const GenerateQuizModal = ({
	isModalOpen,
	setIsModalOpen,
	setSelectedQuiz,
}: Props) => {
	const { user } = useUserStore((state) => state);

	const [questionCount, setQuestionCount] = useState(10);

	const renderUploadInput = () => {
		const handleGenerateQuiz = async (files: File[]) => {
			const file = files[0];
			if (!file || !user?.id) return;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', user?.id);
			formData.append('questionCount', questionCount.toString());

			try {
				const response = await fetch('/api/quiz/generate-ai-response', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const res = await response.json();
				if (res.quiz) {
					setSelectedQuiz(res.quiz);
					setIsModalOpen(false);
				}
			} catch (error) {
				console.error('Error generating quiz:', error);
			}
		};

		return (
			<FileUpload
				onFilesUpload={handleGenerateQuiz}
				filesUploadLabel='Generate'
				acceptedFileTypes='.txt,.pdf'
				maxFileSize={10 * 1024 * 1024} // 10MB
				maxFiles={1}
			/>
		);
	};

	const renderModalFooter = () => {
		return (
			<div className='flex items-center gap-1'>
				<Button
					variant='secondary'
					onClick={() => setIsModalOpen(false)}
				>
					Close
				</Button>
			</div>
		);
	};

	const renderQuizCountSlider = () => {
		return (
			<div className='w-full flex items-center justify-between mb-4 gap-20'>
				<div className='text-base flex-shrink-0 w-24 text-end'>
					{questionCount} Questions
				</div>
				<Slider
					id='temperature-slider'
					min={0}
					max={20}
					step={1}
					value={[questionCount]}
					onValueChange={(value) => setQuestionCount(value[0])}
					className='cursor-pointer'
				/>
			</div>
		);
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			title='Generate quiz'
			footer={renderModalFooter()}
			titleTooltip={<GeneratedQuestions />}
		>
			{renderQuizCountSlider()}
			{renderUploadInput()}
		</Modal>
	);
};

export default GenerateQuizModal;
