import { Quiz } from '@/db/schema';
import { QuizQuestion } from '@/types/quiz';

export const quizUtils = {
	getQuizDifficultyCounts(quiz: Quiz | null) {
		const counts = {
			easy: 0,
			medium: 0,
			hard: 0,
			total: 0,
		};

		if (!quiz) return counts;

		quiz?.questions.forEach((question: QuizQuestion) => {
			switch (question.difficulty) {
				case 'Easy':
					counts.easy++;
					break;
				case 'Medium':
					counts.medium++;
					break;
				case 'Hard':
					counts.hard++;
					break;
			}
			counts.total++;
		});

		return counts;
	},
};
