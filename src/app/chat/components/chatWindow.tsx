'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { ArrowUp } from 'lucide-react';

import { LoadingOverlay, LoadingWrapper } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createNewChatMessage } from '@/db/queries-chat-messages';
import { createNewChatSession } from '@/db/queries-chat-sessions';
import { ChatSession } from '@/db/schema';
import { useRealtimeChatMessages } from '@/db/supabase-subscriptions/useRealtimeChatMessages';
import { usePrevious } from '@/hooks';
import { useUserStore } from '@/providers/user';

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
	const { toast } = useToast();
	const { messages, isLoading: isChatMessagesLoading } =
		useRealtimeChatMessages(selectedSessionId);
	const { user } = useUserStore((state) => state);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [inputText, setInputText] = useState('');
	const [isSending, setIsSending] = useState(false);

	const prevSelectedSessionId = usePrevious(selectedSessionId);
	useEffect(() => {
		// 在组件挂载时或 selectedSessionId 变为 null 时聚焦
		if (
			textareaRef.current &&
			(selectedSessionId === null || prevSelectedSessionId !== null)
		) {
			textareaRef.current.focus();
		}
	}, [selectedSessionId, prevSelectedSessionId]);

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

	const handleSendMessage = async () => {
		if (!inputText.trim() || isSending || !user?.id) return;

		setIsSending(true);
		try {
			let sessionId = selectedSessionId;

			// 创建一个新的会话，如果没有 selected session
			if (!sessionId) {
				const newSession = await createNewChatSession(user.id);
				setSelectedSessionId(newSession.id);
				sessionId = newSession.id;
			}

			await createNewChatMessage(sessionId, inputText.trim());
			setInputText('');
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An unexpected error occurred.',
				description: 'Please try again later.',
			});
		} finally {
			setIsSending(false);
		}
	};

	const renderSendButton = () => {
		return (
			<Button
				size='icon'
				className='absolute right-4 bottom-1 h-8 w-8 rounded-full'
				disabled={inputText === '' || isSending}
				onClick={handleSendMessage}
			>
				<LoadingWrapper isLoading={isSending}>
					<ArrowUp className='h-5 w-5' />
				</LoadingWrapper>
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
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
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
