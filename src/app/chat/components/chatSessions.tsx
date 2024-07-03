import React, { useState, useRef, useEffect } from 'react';

import { Pen, Trash } from 'lucide-react';

import { LoadingOverlay, TooltipWrapper } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteChatSession, updateChatSessionName } from '@/db/queries-chat';
import { ChatSession } from '@/db/schema';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';

type Props = {
	selectedSessionsId: string;
};

const ChatSessions = ({ selectedSessionsId }: Props) => {
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
					<TooltipWrapper tooltip='rename' positionOffset={5}>
						<Pen
							className='action-button w-4 h-4'
							onClick={() =>
								handleRename(session.id, session.name)
							}
						/>
					</TooltipWrapper>
					<TooltipWrapper tooltip='delete' positionOffset={5}>
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

		return sessions.map((session) => (
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
	};

	return (
		<div className='w-full h-full p-4 box-border outline'>
			<div className='w-full h-full flex flex-col'>{renderContent()}</div>
		</div>
	);
};

export default ChatSessions;
