'use client';

import { useState } from 'react';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';
import { AIProvider } from '@/types/AI';

import ChatSessions from './components/chatSessions';
import ChatWindow from './components/chatWindow';

export type ModelConfig = {
	provider: AIProvider;
	temperature: number;
	system: string;
};

export default function ChatPage() {
	const { sessions, isLoading: isChatSessionsLoading } =
		useRealtimeChatSessions();

	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null
	);
	const [modelConfig, setModelConfig] = useState<ModelConfig>({
		provider: AIProvider.anthropic,
		temperature: 0.7,
		system: '',
	});

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
			modelConfig={modelConfig}
			setModelConfig={setModelConfig}
		/>
	);

	const renderChatPanel = () => (
		<ChatWindow
			sessions={sessions}
			isChatSessionsLoading={isChatSessionsLoading}
			selectedSessionId={selectedSessionId}
			setSelectedSessionId={setSelectedSessionId}
			modelConfig={modelConfig}
			setModelConfig={setModelConfig}
		/>
	);

	return (
		<div className='w-full h-full p-4 box-border'>
			<ResizablePanelGroup direction='horizontal'>
				<ResizablePanel
					defaultSize={20}
					minSize={15}
					className='border rounded-lg bg-card min-w-[16rem] h-[calc(100dvh_-_6rem)]'
				>
					{renderSessionsPanel()}
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={80}
					minSize={30}
					className='border rounded-lg bg-card min-w-[20rem] h-[calc(100dvh_-_6rem)]'
				>
					{renderChatPanel()}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
