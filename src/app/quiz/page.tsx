'use client';

import { useState } from 'react';

import clsx from 'clsx';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Quiz } from '@/db/schema';
import { useRealtimeQuizzes } from '@/db/supabase-subscriptions/useRealtimeQuizzes';

import ConfigSection from './components/configSection';
import QuizzesSection from './components/quizzesSection';

export default function QuizPage() {
	const { quizzes, isLoading: isQuizzesLoading } = useRealtimeQuizzes();

	const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

	const renderResizeBar = (horizontal?: boolean) => {
		return (
			<ResizableHandle
				disabled
				className={clsx(
					'bg-transparent rounded-full hover:bg-primary/30 flex items-center justify-center',
					{
						'min-h-[0.3rem] my-[0.15rem]': horizontal,
						'min-w-[0.3rem] mx-[0.15rem]': !horizontal,
						'pointer-events-none': true, // disabled for now
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
					// minSize={25}
					className='border rounded-lg bg-card min-w-[30rem] h-[calc(100dvh_-_6rem)]'
				>
					<ConfigSection
						quizzes={quizzes}
						isQuizzesLoading={isQuizzesLoading}
						selectedQuiz={selectedQuiz}
						setSelectedQuiz={setSelectedQuiz}
					/>
				</ResizablePanel>

				{renderResizeBar()}

				<ResizablePanel
					defaultSize={65}
					// minSize={30}
					className='border rounded-lg bg-card min-w-[35rem] h-[calc(100dvh_-_6rem)]'
				>
					<QuizzesSection
						quizzes={quizzes}
						isQuizzesLoading={isQuizzesLoading}
						selectedQuiz={selectedQuiz}
						setSelectedQuiz={setSelectedQuiz}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
