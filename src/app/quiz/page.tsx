'use client';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useUserStore } from '@/providers/user';

export default function QuizPage() {
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

	const renderConfigPanel = () => {
		return (
			<ResizablePanelGroup direction='vertical'>
				<ResizablePanel
					defaultSize={40}
					className='border rounded-lg bg-card'
				>
					<div className='flex h-full items-center justify-center p-6'>
						<span className='font-semibold'>Two</span>
					</div>
				</ResizablePanel>
				{renderResizeBar(true)}
				<ResizablePanel
					defaultSize={60}
					className='border rounded-lg bg-card'
				>
					<div className='flex h-full items-center justify-center p-6'>
						<span className='font-semibold'>Three</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border'>
			<ResizablePanelGroup
				direction='horizontal'
				className='max-w-full max-h-full'
			>
				<ResizablePanel defaultSize={40}>
					{renderConfigPanel()}
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={60}
					className='border rounded-lg bg-card'
				>
					Main
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
