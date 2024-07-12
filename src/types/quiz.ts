export type QuizQuestionType = 'MultipleChoice' | 'SingleChoice';
export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizAnswer {
	answerText: string;
	isCorrect: boolean;
}

export interface QuizQuestion {
	questionText: string;
	type: QuizQuestionType;
	difficulty: QuizDifficulty;
	explanation: string;
	answers: QuizAnswer[];
	hints: string[];
	points: number;
	suggestedTime: number; // 以秒为单位的建议回答时间
}

export type QuizQuestions = QuizQuestion[];

export interface Quiz {
	name: string;
	description: string;
	questions: QuizQuestions;
	totalPoints: number;
	totalTime: number; // 整个测验的总时间（秒）
}
