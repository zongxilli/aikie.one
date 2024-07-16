import React, { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import {
	EllipsisVerticalIcon,
	LucideIcon,
	Pen,
	SquareArrowOutUpRight,
	Trash,
} from 'lucide-react';

import { RenameModal } from '@/components/shared';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { deleteQuiz, updateQuizName } from '@/db/queries-quizzes';
import { Quiz } from '@/db/schema';
import { useUserStore } from '@/providers/user';

import { formatUtils } from '../../../../utils/format';
import { quizUtils } from '../../../../utils/quiz';

type Props = {
	quiz: Quiz;
	onClick: () => void;
	selected: boolean;
};

const QuizCard: React.FC<Props> = React.memo(({ quiz, onClick, selected }) => {
	const { toast } = useToast();
	const user = useUserStore((state) => state.user);

	const [showRenameQuizModal, setShowRenameQuizModal] = useState(false);
	const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);

	const difficultyCounts = useMemo(
		() => quizUtils.getQuizDifficultyCounts(quiz),
		[quiz]
	);

	const handleDeleteQuiz = useCallback(() => {
		if (user?.id) {
			deleteQuiz(quiz.id, user.id);
			toast({
				variant: 'destructive',
				title: 'Quiz deleted',
				description: 'This quiz has been deleted permanently',
			});
		}
	}, [user?.id, quiz.id, toast]);

	const handleRename = useCallback(
		async (newName: string) => {
			if (!user?.id) return;
			await updateQuizName(quiz.id, user.id, newName);
			toast({
				variant: 'success',
				title: 'Quiz renamed',
				description: 'This quiz has been successfully renamed',
			});
		},
		[user?.id, quiz.id, toast]
	);

	const renderDropdownMenuItem = useCallback(
		(
			Icon: LucideIcon,
			label: string,
			onClickHandler: () => void,
			warning?: boolean
		) => (
			<DropdownMenuItem
				className={clsx('flex items-center gap-2 cursor-pointer', {
					'text-red-600': warning,
				})}
				onClick={onClickHandler}
				key={label}
			>
				<Icon className='w-3 h-3' />
				{label}
			</DropdownMenuItem>
		),
		[]
	);

	const renderDropdownMenuItems = useCallback(
		() => (
			<>
				{renderDropdownMenuItem(
					SquareArrowOutUpRight,
					'Start quiz',
					onClick,
					false
				)}
				{renderDropdownMenuItem(
					Pen,
					'Rename',
					() => setShowRenameQuizModal(true),
					false
				)}
				{renderDropdownMenuItem(
					Trash,
					'Delete',
					() => setShowDeleteQuizModal(true),
					true
				)}
			</>
		),
		[onClick, renderDropdownMenuItem]
	);

	const renderRenameQuizModal = useCallback(
		() => (
			<RenameModal
				showModal={showRenameQuizModal}
				setShowModal={setShowRenameQuizModal}
				onConfirm={handleRename}
				initialValue={quiz.name}
			/>
		),
		[showRenameQuizModal, handleRename, quiz.name]
	);

	const renderDeleteQuizModal = useCallback(
		() => (
			<AlertDialog
				open={showDeleteQuizModal}
				onOpenChange={setShowDeleteQuizModal}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will permanently delete the quiz.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteQuiz}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		),
		[showDeleteQuizModal, handleDeleteQuiz]
	);

	const renderDetailsProgressBar = useMemo(() => {
		const { easy, medium, hard, total } = difficultyCounts;
		const easyWidth = (easy / total) * 100;
		const mediumWidth = (medium / total) * 100;
		const hardWidth = (hard / total) * 100;

		return (
			<div className='w-full h-1 flex absolute left-0 bottom-0'>
				<div
					style={{ width: `${easyWidth}%` }}
					className='h-full bg-difficulty-easy'
				/>
				<div
					style={{ width: `${mediumWidth}%` }}
					className='h-full bg-difficulty-medium'
				/>
				<div
					style={{ width: `${hardWidth}%` }}
					className='h-full bg-difficulty-hard'
				/>
			</div>
		);
	}, [difficultyCounts]);

	return (
		<>
			<Card
				key={quiz.id}
				className={clsx(
					'w-full h-32 flex flex-col items-start gap-1 cursor-pointer box-border border hover:bg-google-blue dark:hover:bg-google-blue/30 relative overflow-hidden',
					{ 'bg-google-blue dark:bg-google-blue/30': selected }
				)}
				onClick={onClick}
			>
				<div className='py-2 px-4 box-border w-full h-full flex flex-col justify-between items-start'>
					<div className='w-full flex items-center justify-between gap-2'>
						<div className='text-md text-one-line'>{quiz.name}</div>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<EllipsisVerticalIcon size={20} />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{renderDropdownMenuItems()}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className='text-sm text-foreground/70 mb-1'>
						Create at{' '}
						{formatUtils.formatDateTime(quiz.created_at, {
							includeTime: false,
						})}
					</div>
				</div>
				{renderDetailsProgressBar}
			</Card>
			{renderRenameQuizModal()}
			{renderDeleteQuizModal()}
		</>
	);
});

QuizCard.displayName = 'QuizCard';

export default QuizCard;
