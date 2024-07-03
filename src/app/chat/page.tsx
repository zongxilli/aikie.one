'use client';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useUserStore } from '@/providers/user';

import ChatSessions from './components/chatSessions';
import ChatWindow from './components/chatWindow';

export default function ChatPage() {
	const { user, isLoading, error } = useUserStore((state) => state);

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

	const renderSessionsPanel = () => <ChatSessions />;

	const renderChatPanel = () => <ChatWindow />;

	return (
		<div className='w-full h-full p-4 box-border'>
			<ResizablePanelGroup
				direction='horizontal'
				className='max-w-full max-h-full'
			>
				<ResizablePanel
					defaultSize={30}
					className='border rounded-lg bg-card'
				>
					{renderSessionsPanel()}
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={70}
					className='border rounded-lg bg-card'
				>
					{renderChatPanel()}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
