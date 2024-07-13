import { Dispatch, SetStateAction } from 'react';

import { FileUpload } from '@/components/shared';
import { Quiz } from '@/db/schema';
import { useUserStore } from '@/providers/user';

import QuizSummary from './quizSummary';

type Props = {
	quizzes: Quiz[];
	isQuizzesLoading: boolean;
	selectedQuiz: Quiz | null;
	setSelectedQuiz: Dispatch<SetStateAction<Quiz | null>>;
};

const ConfigSection = ({
	quizzes,
	isQuizzesLoading,
	selectedQuiz,
	setSelectedQuiz,
}: Props) => {
	const { user, isLoading, error } = useUserStore((state) => state);

	const renderUploadInput = () => {
		const handleGenerateQuiz = async (files: File[]) => {
			const file = files[0];
			if (!file || !user?.id) return;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', user?.id);
			formData.append('questionCount', '7');

			try {
				const response = await fetch('/api/quiz/generate-ai-response', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				console.log('Generated quiz:', result);
				// 处理生成的测验数据...
			} catch (error) {
				console.error('Error generating quiz:', error);
			}
		};

		return (
			<FileUpload
				onFilesUpload={handleGenerateQuiz}
				filesUploadLabel='Generate quiz'
				acceptedFileTypes='.txt,.pdf'
				maxFileSize={10 * 1024 * 1024} // 10MB
				maxFiles={5}
			/>
		);
	};

	const renderQuizSummary = () => {
		return <QuizSummary selectedQuiz={selectedQuiz} />;
	};

	return (
		<div className='w-full h-full p-4 box-border flex flex-col'>
			{renderQuizSummary()}
			{renderUploadInput()}
		</div>
	);
};

export default ConfigSection;
