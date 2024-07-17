import { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';

import AnimatedCircularProgressBar, {
	CircleProgressBarSize,
} from '@/components/magicui/animated-circular-progress-bar';
import { CollapsiblePanels } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Quiz } from '@/db/schema';
import { QuizQuestion } from '@/types/quiz';

import { formatUtils } from '../../../../utils/format';
import { quizUtils } from '../../../../utils/quiz';

type Props = {
	selectedQuiz: Quiz | null;
};

const QuizSummary = ({ selectedQuiz }: Props) => {
	const [showAnswers, setShowAnswers] = useState(false);

	const { easy, medium, hard, total } = useMemo(
		() => quizUtils.getQuizDifficultyCounts(selectedQuiz),
		[selectedQuiz]
	);

	const renderDifficultyCharts = useCallback(() => {
		const renderChart = (
			color: string,
			label: string,
			value: number = 0
		) => (
			<AnimatedCircularProgressBar
				key={label}
				max={selectedQuiz !== null ? total : 100}
				min={0}
				value={value}
				label={label}
				gaugePrimaryColor={color}
				gaugeSecondaryColor='#d1d5db'
				size={CircleProgressBarSize.medium}
			/>
		);

		return (
			<div className='w-full my-4 flex justify-around items-center'>
				{renderChart('#8B5CF6', 'Easy', easy)}
				{renderChart('#3B82F6', 'Medium', medium)}
				{renderChart('#E11D48', 'Hard', hard)}
			</div>
		);
	}, [selectedQuiz, total, easy, medium, hard]);

	const renderQuizInfo = useCallback(() => {
		if (!selectedQuiz) return null;

		const renderQuestionTitle = (question: QuizQuestion) => {
			return (
				<div className='text-sm text-foreground/60 w-full text-start'>
					{question.questionText}
					{question.type === 'MultipleChoice' && (
						<Badge className='ml-2 font-extralight'>Multiple</Badge>
					)}
				</div>
			);
		};

		const renderQuestionContent = (question: QuizQuestion) => {
			return (
				<div>
					{question.answers.map((a) => (
						<div
							className={clsx('', {
								'text-foreground/80': !(
									a.isCorrect && showAnswers
								),
								'text-green-500': a.isCorrect && showAnswers,
							})}
							key={a.answerText}
						>
							{a.answerText}
						</div>
					))}
				</div>
			);
		};

		return (
			<div className='w-full flex flex-col gap-6'>
				<div className='w-full flex items-start justify-between'>
					<div>Name</div>
					<div className='text-foreground/60'>
						{selectedQuiz.name}
					</div>
				</div>

				<div className='w-full flex items-start justify-between'>
					<div>Total questions</div>
					<div className='text-foreground/60'>
						{selectedQuiz.questions.length}
					</div>
				</div>

				<div className='w-full flex items-start justify-between'>
					<div className=''>Created at</div>
					<div className='text-foreground/60'>
						{formatUtils.formatDateTime(selectedQuiz?.created_at)}
					</div>
				</div>

				<div className='w-full flex items-start justify-between gap-20'>
					<div>Description</div>
					<div className='text-foreground/60'>
						{selectedQuiz.description}
					</div>
				</div>

				<div className='w-full'>
					<div className='w-full flex items-center justify-between'>
						Questions
						<div className='flex items-center space-x-2'>
							<Checkbox
								id='show answers'
								className='rounded'
								checked={showAnswers}
								onCheckedChange={(value: boolean) => {
									setShowAnswers(value);
								}}
							/>
							<label
								htmlFor='show answers'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Show correct answers
							</label>
						</div>
					</div>
					<div>
						<CollapsiblePanels
							items={selectedQuiz.questions.map((q) => ({
								key: q.questionText,
								title: renderQuestionTitle(q),
								content: renderQuestionContent(q),
							}))}
						/>
					</div>
				</div>
			</div>
		);
	}, [selectedQuiz, showAnswers]);

	return (
		<div className=''>
			{renderDifficultyCharts()}
			{renderQuizInfo()}
		</div>
	);
};

export default QuizSummary;
