import { useEffect, useRef, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ChatWindow = () => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [inputText, setInputText] = useState('');

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			const adjustHeight = () => {
				textarea.style.height = 'auto';
				textarea.style.height = `${textarea.scrollHeight}px`;
			};

			textarea.addEventListener('input', adjustHeight);
			return () => textarea.removeEventListener('input', adjustHeight);
		}
	}, []);

	const renderSendButton = () => {
		return (
			<Button
				size='icon'
				className='absolute right-4 bottom-1 h-8 w-8 rounded-full'
				disabled={inputText === ''}
				onClick={() => {
					// TODO: send message to API
				}}
			>
				<ArrowUp className='h-5 w-5' />
			</Button>
		);
	};

	const renderChatHistory = () => {
		return (
			<div className='w-full h-full max-w-[80rem] flex flex-col'></div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border relative flex justify-center'>
			{renderChatHistory()}
			<div className='absolute bottom-2 left-[5%] w-[90%] flex justify-center'>
				<div className='relative w-full max-w-[50rem] rounded-xl border'>
					<Textarea
						ref={textareaRef}
						className='px-10 box-border min-h-10 max-h-64 resize-none overflow-y-auto'
						placeholder='Type a message...'
						onChange={(e) => setInputText(e.target.value)}
						value={inputText}
						rows={1}
					/>
					{renderSendButton()}
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
