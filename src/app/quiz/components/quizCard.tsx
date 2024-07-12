import React, { useState } from 'react';

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

type Props = {
	quiz: Quiz;
};

const QuizCard = ({ quiz }: Props) => {
	const { toast } = useToast();
	const { user } = useUserStore((state) => state);

	const [showRenameQuizModal, setShowRenameQuizModal] = useState(false);
	const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);

	const handleDeleteQuiz = () => {
		if (user?.id) deleteQuiz(quiz.id, user.id);

		toast({
			variant: 'destructive',
			title: 'Quiz deleted',
			description: 'This quiz has been deleted permanently',
		});
	};

	const handleRename = async (newName: string) => {
		if (!user?.id) return;

		await updateQuizName(quiz.id, user.id, newName);

		toast({
			variant: 'success',
			title: 'Quiz renamed',
			description: 'This quiz has been successfully renamed',
		});
	};

	const renderDropdownMenuItem = (
		Icon: LucideIcon,
		label: string,
		onClickHandler: () => void,
		warning?: boolean
	) => {
		return (
			<DropdownMenuItem
				className={clsx('flex items-center gap-2 cursor-pointer', {
					' text-red-600': warning,
				})}
				onClick={onClickHandler}
				key={label}
			>
				<Icon className='w-3 h-3' />
				{label}
			</DropdownMenuItem>
		);
	};

	const renderDropdownMenuItems = () => {
		return (
			<>
				{renderDropdownMenuItem(
					SquareArrowOutUpRight,
					'Start quiz',
					() => {},
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
		);
	};

	const renderRenameQuizModal = () => {
		return (
			<RenameModal
				showModal={showRenameQuizModal}
				setShowModal={setShowRenameQuizModal}
				onConfirm={handleRename}
				initialValue={quiz.name}
			/>
		);
	};

	const renderDeleteQuizModal = () => {
		return (
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
		);
	};

	const renderDropdownMenu = () => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger>
					<EllipsisVerticalIcon size={20} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{renderDropdownMenuItems()}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	return (
		<>
			<Card
				key={quiz.id}
				className='w-full h-32 flex flex-col items-start gap-1'
			>
				<div className='py-2 px-4 box-border w-full'>
					<div className='flex items-center justify-between gap-2'>
						<div className='text-md text-one-line'>{quiz.name}</div>
						{renderDropdownMenu()}
					</div>
				</div>
			</Card>
			{renderRenameQuizModal()}
			{renderDeleteQuizModal()}
		</>
	);
};

export default QuizCard;
