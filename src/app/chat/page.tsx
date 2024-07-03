'use client';

import { useState } from 'react';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';
import { useUserStore } from '@/providers/user';

import ChatSessions from './components/chatSessions';
import ChatWindow from './components/chatWindow';

export default function ChatPage() {
	const { user } = useUserStore((state) => state);
	const { sessions, isLoading: isChatSessionsLoading } =
		useRealtimeChatSessions();

	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null
	);

	const renderResizeBar = (horizontal?: boolean) => {
		return (
			<ResizableHandle
				className={clsx(
					'bg-transparent rounded-full hover:bg-primary/30 flex items-center justify-center',
					{
						'min-h-[0.3rem] my-[0.15rem]': horizontal,
						'min-w-[0.3rem] mx-[0.15rem]': !horizontal,
					}
				)}
			/>
		);
	};

	const renderSessionsPanel = () => (
		<ChatSessions
			sessions={sessions}
			isLoading={isChatSessionsLoading}
			selectedSessionId={selectedSessionId}
			setSelectedSessionId={setSelectedSessionId}
		/>
	);

	const renderChatPanel = () => (
		<ChatWindow
			sessions={sessions}
			isChatSessionsLoading={isChatSessionsLoading}
			selectedSessionId={selectedSessionId}
			setSelectedSessionId={setSelectedSessionId}
		/>
	);

	return (
		<div className='w-full h-full p-4 box-border'>
			<ResizablePanelGroup direction='horizontal'>
				<ResizablePanel
					defaultSize={20}
					minSize={15}
					className='border rounded-lg bg-card'
				>
					{renderSessionsPanel()}
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={80}
					minSize={30}
					className='border rounded-lg bg-card'
				>
					{renderChatPanel()}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
