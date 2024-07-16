import AnimatedCircularProgressBar, {
	CircleProgressBarSize,
} from '@/components/magicui/animated-circular-progress-bar';
import { Quiz } from '@/db/schema';

import { quizUtils } from '../../../../utils/quiz';

type Props = {
	selectedQuiz: Quiz | null;
};

const QuizSummary = ({ selectedQuiz }: Props) => {
	const { easy, medium, hard, total } =
		quizUtils.getQuizDifficultyCounts(selectedQuiz);

	const renderDifficultyCharts = () => {
		const renderChart = (
			color: string,
			label: string,
			value: number = 0
		) => (
			<AnimatedCircularProgressBar
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
	};

	return <div>{renderDifficultyCharts()}</div>;
};

export default QuizSummary;
