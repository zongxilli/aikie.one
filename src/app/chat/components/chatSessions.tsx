import React, { useState, useRef, useEffect } from 'react';

import { ListPlus, Pen, Trash } from 'lucide-react';

import { LoadingOverlay, TooltipWrapper } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	createNewSession,
	deleteChatSession,
	updateChatSessionName,
} from '@/db/queries-chat';
import { ChatSession } from '@/db/schema';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';
import { useUserStore } from '@/providers/user';

type Props = {
	selectedSessionsId: string;
};

const ChatSessions = ({ selectedSessionsId }: Props) => {
	const { user } = useUserStore((state) => state);
	const { sessions, isLoading } = useRealtimeChatSessions();

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editingId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingId]);

	const handleRename = (sessionId: string, currentName: string) => {
		setEditingId(sessionId);
		setEditingName(currentName);
	};

	const handleRenameSubmit = async (sessionId: string, userId: string) => {
		if (editingName.trim() !== '') {
			await updateChatSessionName(sessionId, userId, editingName.trim());
		}
		setEditingId(null);
	};

	const renderContent = () => {
		if (isLoading)
			return <LoadingOverlay label='Loading conversations...' />;

		const renderSessionActionButtons = (session: ChatSession) => {
			if (editingId === session.id) return null;

			return (
				<div className='items-center gap-3 hidden group-hover:flex group-[.selected]:flex'>
					<TooltipWrapper tooltip='rename'>
						<Pen
							className='action-button w-4 h-4'
							onClick={() =>
								handleRename(session.id, session.name)
							}
						/>
					</TooltipWrapper>
					<TooltipWrapper tooltip='delete'>
						<Trash
							className='action-button w-4 h-4'
							onClick={() =>
								deleteChatSession(session.id, session.user_id)
							}
						/>
					</TooltipWrapper>
				</div>
			);
		};

		const renderSessionLabel = (session: ChatSession) => {
			if (editingId === session.id)
				return (
					<Input
						ref={inputRef}
						value={editingName}
						onChange={(e) => setEditingName(e.target.value)}
						onBlur={() =>
							handleRenameSubmit(session.id, session.user_id)
						}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleRenameSubmit(session.id, session.user_id);
							}
						}}
						className='flex-grow h-full outline'
					/>
				);

			return (
				<p className='text-one-line flex-grow text-left'>
					{session.name}
				</p>
			);
		};

		const renderSessions = () =>
			sessions.map((session) => (
				<Button
					variant='ghost'
					className='flex items-center justify-between gap-4 group'
					key={session.id}
					selected={session.id === selectedSessionsId}
				>
					{renderSessionLabel(session)}
					{renderSessionActionButtons(session)}
				</Button>
			));

		const renderCreateNewSessionButton = () => {
			return (
				<TooltipWrapper tooltip='Start a new chat'>
					<Button
						variant='ghost'
						size='icon'
						className='ml-auto mb-4'
						onClick={() => {
							if (user && user.id) createNewSession(user?.id);
						}}
					>
						<ListPlus className='h-5 w-5' />
					</Button>
				</TooltipWrapper>
			);
		};

		return (
			<div className='w-full h-full flex flex-col'>
				{renderCreateNewSessionButton()}
				{renderSessions()}
			</div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border outline'>
			<div className='w-full h-full flex flex-col'>{renderContent()}</div>
		</div>
	);
};

export default ChatSessions;
