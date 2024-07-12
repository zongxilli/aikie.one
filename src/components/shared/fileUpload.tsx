import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';

import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { PiFilePdfLight, PiFileTxtLight, PiFile } from 'react-icons/pi';

import { Button } from '../ui/button';

import TooltipWrapper from './tooltipWrapper';

interface FileUploadProps {
	onFilesUpload: (files: File[]) => void;
	filesUploadLabel?: string;
	acceptedFileTypes?: string; // e.g. ".txt,.pdf"
	maxFileSize?: number; // in bytes
	maxFiles?: number;
}

interface FileWithProgress extends File {
	error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
	onFilesUpload,
	filesUploadLabel = 'Upload files',
	acceptedFileTypes = '.txt,.pdf',
	maxFileSize = 5 * 1024 * 1024, // 5MB default
	maxFiles = 5,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [files, setFiles] = useState<FileWithProgress[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
	};

	const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		handleFiles(selectedFiles);
	};

	const handleFiles = (newFiles: File[]) => {
		const updatedFiles = [...files];
		newFiles.forEach((file) => {
			if (updatedFiles.length >= maxFiles) {
				return;
			}
			const fileWithProgress: FileWithProgress = file;
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			const acceptedExtensions = acceptedFileTypes
				.split(',')
				.map((type) => type.trim().replace('.', ''));

			if (!acceptedExtensions.includes(fileExtension || '')) {
				fileWithProgress.error = 'Invalid file type';
			} else if (file.size > maxFileSize) {
				fileWithProgress.error = 'File too large';
			}

			updatedFiles.push(fileWithProgress);
		});
		setFiles(updatedFiles);
	};

	const removeFile = (index: number) => {
		const updatedFiles = files.filter((_, i) => i !== index);
		setFiles(updatedFiles);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const renderUploadFilePlaceholder = () => {
		return (
			<div
				className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
					isDragging
						? 'border-primary bg-primary/10'
						: 'border-gray-300 hover:border-primary'
				}`}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={handleClick}
			>
				<input
					type='file'
					ref={fileInputRef}
					onChange={handleFileInput}
					accept={acceptedFileTypes}
					className='hidden'
					multiple
				/>
				<UploadCloud className='mx-auto h-12 w-12 text-gray-400' />
				<p className='mt-2 text-md text-gray-600'>
					Drag and drop files here, or click to select files
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Supported file types: {acceptedFileTypes}
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Max file size: {maxFileSize / (1024 * 1024)}MB
				</p>
				<p className='mt-1 text-sm text-gray-500'>
					Max files: {maxFiles}
				</p>
			</div>
		);
	};

	const renderFiles = () => {
		if (files.length === 0) return null;

		const renderDeleteIcon = (index: number) => {
			return (
				<TooltipWrapper tooltip='delete file'>
					<X
						className='h-4 w-4 action-button'
						onClick={() => removeFile(index)}
					/>
				</TooltipWrapper>
			);
		};

		const renderFileNameWithErrorIcon = (file: FileWithProgress) => {
			const renderFileTypeIcon = () => {
				// PDF
				if (file.type === 'application/pdf')
					return <PiFilePdfLight className='w-5 h-5 mr-2' />;
				// TXT
				else if (file.type === 'text/plain')
					return <PiFileTxtLight className='w-5 h-5 mr-2' />;

				return <PiFile className='w-5 h-5 mr-2' />;
			};

			const renderErrorIcon = () => {
				if (!file.error) return null;

				return (
					<TooltipWrapper tooltip={file.error}>
						<AlertCircle className='ml-2 h-4 w-4 text-red-500' />
					</TooltipWrapper>
				);
			};

			return (
				<div className='flex-grow min-w-0 flex items-center'>
					{renderFileTypeIcon()}
					<span className='text-one-line text-sm'>{file.name}</span>
					{renderErrorIcon()}
				</div>
			);
		};

		return (
			<div className='flex flex-col gap-1 overflow-auto'>
				{files.map((file, index) => (
					<Button
						key={index}
						variant='secondary'
						className='flex items-center justify-between gap-4 group'
					>
						{renderFileNameWithErrorIcon(file)}
						{renderDeleteIcon(index)}
					</Button>
				))}
			</div>
		);
	};

	const renderHeader = () => {
		return (
			<div className='w-full mb-4 flex items-center justify-between'>
				<div className='text-lg'>Upload files</div>
				<Button
					onClick={() => {
						onFilesUpload(files.filter((file) => !file.error));
					}}
					disabled={files.length === 0}
				>
					{filesUploadLabel}
				</Button>
			</div>
		);
	};

	return (
		<div className='w-full h-[calc(100dvh_-_8rem)] flex flex-col gap-2'>
			{renderHeader()}
			{renderUploadFilePlaceholder()}
			{renderFiles()}
		</div>
	);
};

export default FileUpload;
