import { FileUpload } from '@/components/shared';

const UploadSection = () => {
	const renderUploadInput = () => {
		const handleFilesSelect = (files: File[]) => {
			console.log('Selected files:', files);
			// 这里可以添加文件处理逻辑
		};

		return (
			<FileUpload
				onFilesUpload={handleFilesSelect}
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
