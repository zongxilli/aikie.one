'use client';

import {
	Dispatch,
	SetStateAction,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import clsx from 'clsx';
import { ArrowUp } from 'lucide-react';

import {
	GPT4oResponseRenderer,
	LoadingOverlay,
	LoadingWrapper,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createNewChatMessage } from '@/db/queries-chat-messages';
import { createNewChatSession } from '@/db/queries-chat-sessions';
import { ChatSession, Message } from '@/db/schema';
import { useRealtimeChatMessages } from '@/db/supabase-subscriptions/useRealtimeChatMessages';
import { usePrevious } from '@/hooks';
import { useUserStore } from '@/providers/user';

const MemoizedMessage = memo(({ message }: { message: Message }) => {
	if (message.role === 'user') {
		return (
			<div
				className={clsx(
					'rounded-full px-6 mb-4 max-w-[80%] ml-auto bg-primary text-primary-foreground'
				)}
			>
				<div className='min-h-12 flex items-center'>
					{message.content}
				</div>
			</div>
		);
	}
	return (
		<Card className={clsx('mb-4 w-full mr-auto bg-secondary')}>
			<CardContent>
				<GPT4oResponseRenderer content={message.content} />
			</CardContent>
		</Card>
	);
});

MemoizedMessage.displayName = 'MemoizedMessage';

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
	const chatHistoryRef = useRef<HTMLDivElement>(null);
	const [inputText, setInputText] = useState('');
	const [isSending, setIsSending] = useState(false);

	const prevSelectedSessionId = usePrevious(selectedSessionId);

	// 有新的 message 就自动 scroll
	useEffect(() => {
		// Scroll to bottom when messages change
		if (chatHistoryRef.current) {
			chatHistoryRef.current.scrollTop =
				chatHistoryRef.current.scrollHeight;
		}
	}, [messages]);

	// 自动 focus input
	useEffect(() => {
		// 在组件挂载时或 selectedSessionId 变为 null 时聚焦
		if (
			textareaRef.current &&
			(selectedSessionId === null || prevSelectedSessionId !== null)
		) {
			textareaRef.current.focus();
		}
	}, [selectedSessionId, prevSelectedSessionId]);

	// input 自动变高
	const adjustHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto';

			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};
	useEffect(() => {
		adjustHeight();
	}, [inputText]);

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
			<div
				ref={chatHistoryRef}
				className='w-full h-[calc(100dvh_-_12rem)] max-w-[60rem] flex flex-col overflow-auto rounded-lg'
			>
				{messages.map((message) => (
					<MemoizedMessage key={message.id} message={message} />
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
		<div className='w-full h-full p-4 box-border relative flex flex-col items-center justify-start'>
			{renderChatHistory()}
			{renderChatInput()}
		</div>
	);
};

export default ChatWindow;
