import { Dispatch, SetStateAction } from 'react';

import { FileUpload, Modal } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/providers/user';

type Props = {
	isModalOpen: boolean;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const GenerateQuizModal = ({ isModalOpen, setIsModalOpen }: Props) => {
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
				filesUploadLabel='Generate'
				acceptedFileTypes='.txt,.pdf'
				maxFileSize={10 * 1024 * 1024} // 10MB
				maxFiles={5}
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

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={() => setIsModalOpen(false)}
			title='Generate quiz'
			footer={renderModalFooter()}
		>
			{renderUploadInput()}
		</Modal>
	);
};

export default GenerateQuizModal;
