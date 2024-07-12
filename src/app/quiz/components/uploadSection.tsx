import { FileUpload } from '@/components/shared';
import { useUserStore } from '@/providers/user';

const UploadSection = () => {
	const { user, isLoading, error } = useUserStore((state) => state);

	const renderUploadInput = () => {
		const handleGenerateQuiz = async (files: File[]) => {
			const file = files[0];
			if (!file || !user?.id) return;

			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', user?.id);

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

	return (
		<div className='w-full h-full p-4 box-border flex flex-col'>
			{renderUploadInput()}
		</div>
	);
};

export default UploadSection;
