'use client';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useUserStore } from '@/providers/user';

import UploadSection from './components/uploadSection';
import QuizzesSection from './components/quizzesSection';

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

	return (
		<div className='w-full h-full p-4 box-border'>
			<ResizablePanelGroup direction='horizontal'>
				<ResizablePanel
					defaultSize={35}
					minSize={25}
					className='border rounded-lg bg-card min-w-[16rem]'
				>
					<UploadSection />
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={65}
					minSize={30}
					className='border rounded-lg bg-card min-w-[20rem]'
				>
					<QuizzesSection />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
