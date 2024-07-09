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
import Image from 'next/image';

import {
	AIResponseRenderer,
	LoadingOverlay,
	LoadingWrapper,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createNewChatSession } from '@/db/queries-chat-sessions';
import { ChatSession, Message } from '@/db/schema';
import { useRealtimeChatMessages } from '@/db/supabase-subscriptions/useRealtimeChatMessages';
import { usePrevious } from '@/hooks';
import { useUserStore } from '@/providers/user';
import { AIProvider } from '@/types/AI';

import chatgpt from '../../../../public/chatgpt.svg';
import claude from '../../../../public/claude.svg';
import { ModelConfig } from '../page';

const MemoizedMessage = memo(({ message }: { message: Message }) => {
	if (message.role === 'user') {
		return (
			<Card
				className={clsx(
					'rounded-[2rem] px-6 py-4 mb-4 max-w-[80%] ml-auto bg-primary text-primary-foreground'
				)}
			>
				{message.content}
			</Card>
		);
	}
	return (
		<Card
			className={clsx('mb-4 p-2 box-border w-full mr-auto bg-secondary')}
		>
			<AIResponseRenderer content={message.content} />
		</Card>
	);
});

MemoizedMessage.displayName = 'MemoizedMessage';

type Props = {
	selectedSessionId: string | null;
	setSelectedSessionId: Dispatch<SetStateAction<string | null>>;
	sessions: ChatSession[];
	isChatSessionsLoading: boolean;
	modelConfig: ModelConfig;
	setModelConfig: Dispatch<SetStateAction<ModelConfig>>;
};

const ChatWindow = ({
	selectedSessionId,
	setSelectedSessionId,
	sessions,
	isChatSessionsLoading,
	modelConfig,
	setModelConfig,
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
	const scrollToBottom = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			if (chatHistoryRef.current) {
				const lastChild = chatHistoryRef.current.lastElementChild;
				if (lastChild) {
					lastChild.scrollIntoView({ behavior, block: 'end' });
				}
			}
		},
		[]
	);
	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 200);
	}, [messages, scrollToBottom]);

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
			let isNewSession = false;

			if (!sessionId) {
				isNewSession = true;
				const newSession = await createNewChatSession(user.id);
				setSelectedSessionId(newSession.id);
				sessionId = newSession.id;
			}

			setInputText('');

			const response = await fetch('/api/chat/send-message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sessionId,
					content: inputText.trim(),
					api: modelConfig.provider,
					temperature: modelConfig.temperature,
					system: modelConfig.system,
					isNewSession,
					userId: user.id,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}
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
		if (!selectedSessionId) {
			return (
				<div className='w-full h-full flex flex-col items-center justify-center gap-4'>
					<Image
						src={
							modelConfig.provider === AIProvider.anthropic
								? claude
								: chatgpt
						}
						alt='ai provider icon'
						className='w-10 h-10 mb-3'
					/>
					<h2 className='text-2xl font-bold mb-2'>
						Welcome to Your AI Chat Assistant
					</h2>
					<p className='text-muted-foreground mb-6'>
						Select a conversation or start a new one to begin
						chatting.
					</p>
				</div>
			);
		}

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
						className='px-10 box-border min-h-10 max-h-64 resize-none overflow-y-auto text-base'
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
