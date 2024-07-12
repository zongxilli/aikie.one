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
}

export type QuizQuestions = QuizQuestion[];