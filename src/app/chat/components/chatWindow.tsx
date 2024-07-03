'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { LoadingOverlay } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatSession } from '@/db/schema';
import { useRealtimeChatMessages } from '@/db/supabase-subscriptions/useRealtimeChatMessages';

type Props = {
	selectedSessionId: string | null;
	setSelectedSessionId: Dispatch<SetStateAction<string | null>>;
	sessions: ChatSession[];
	isChatSessionsLoading: boolean;
};

const ChatWindow = ({
	selectedSessionId,
	setSelectedSessionId,
	sessions,
	isChatSessionsLoading,
}: Props) => {
	const { messages, isLoading: isChatMessagesLoading } =
		useRealtimeChatMessages(selectedSessionId);

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
					// TODO: if this is a first message with no session selected, we create a new session and select it
				}}
			>
				<ArrowUp className='h-5 w-5' />
			</Button>
		);
	};

	const renderChatHistory = () => {
		if (selectedSessionId && isChatMessagesLoading) {
			return <LoadingOverlay label='Loading chats...' />;
		}

		return (
			<div className='w-full h-full max-w-[80rem] flex flex-col'>
				{messages.map((message) => (
					<p key={message.id}>{message.content}</p>
				))}
			</div>
		);
	};

	const renderChatInput = () => {
		return (
			<div className='absolute bottom-2 left-[5%] w-[90%] flex justify-center'>
				<div className='relative w-full max-w-[50rem] rounded-xl border'>
					<Textarea
						ref={textareaRef}
						className='px-10 box-border min-h-10 max-h-64 resize-none overflow-y-auto'
						placeholder='Type a message...'
						onChange={(e) => setInputText(e.target.value)}
						value={inputText}
						rows={1}
						disabled={isChatSessionsLoading}
					/>
					{renderSendButton()}
				</div>
			</div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border relative flex justify-center'>
			{renderChatHistory()}
			{renderChatInput()}
		</div>
	);
};

export default ChatWindow;
