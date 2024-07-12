'use server';

import { desc, eq, and, like } from 'drizzle-orm';

import { db } from '@/db/index';
import { Quiz, quizzes } from '@/db/schema';

export async function getUserQuizzes(userId: string): Promise<Quiz[]> {
	try {
		const userQuizzes = await db
			.select()
			.from(quizzes)
			.where(eq(quizzes.user_id, userId))
			.orderBy(desc(quizzes.updated_at));

		return userQuizzes;
	} catch (error) {
		throw new Error('Failed to fetch user quizzes');
	}
}

export async function deleteQuiz(
	quizId: string,
	userId: string
): Promise<{ success: boolean; message: string }> {
	try {
		// 首先验证quiz属于该用户
		const quiz = await db
			.select()
			.from(quizzes)
			.where(and(eq(quizzes.id, quizId), eq(quizzes.user_id, userId)))
			.limit(1);

		if (quiz.length === 0) {
			return {
				success: false,
				message:
					'Quiz not found or you do not have permission to delete it.',
			};
		}

		await db.delete(quizzes).where(eq(quizzes.id, quizId));

		return { success: true, message: 'Quiz successfully deleted.' };
	} catch (error) {
		return { success: false, message: 'Failed to delete quiz.' };
	}
}

export async function updateQuizName(
	quizId: string,
	userId: string,
	newName: string
) {
	try {
		const uniqueName = await generateUniqueQuizName(userId, newName);

		await db
			.update(quizzes)
			.set({ name: uniqueName })
			.where(and(eq(quizzes.id, quizId), eq(quizzes.user_id, userId)));
		return {
			success: true,
			message: 'Quiz name updated successfully.',
		};
	} catch (error) {
		return {
			success: false,
			message: 'Failed to update quiz name.',
		};
	}
}

export async function generateUniqueQuizName(
	userId: string,
	baseName: string
): Promise<string> {
	let name = baseName;
	let counter = 0;

	while (true) {
		const existingQuizzes = await db
			.select()
			.from(quizzes)
			.where(
				and(
					eq(quizzes.user_id, userId),
					like(
						quizzes.name,
						counter === 0 ? baseName : `${baseName} (${counter})`
					)
				)
			);

		if (existingQuizzes.length === 0) {
			return name;
		}

		counter++;
		name = `${baseName} (${counter})`;
	}
}

export async function createNewQuiz(
	userId: string,
	quizData: Omit<Quiz, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Quiz> {
	try {
		const [newQuiz] = await db
			.insert(quizzes)
			.values({
				user_id: userId,
				...quizData,
			})
			.returning();

		if (!newQuiz) {
			throw new Error('Failed to create new quiz');
		}

		return newQuiz;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to create new quiz: ${error.message}`);
		} else {
			throw new Error(
				'An unexpected error occurred while creating new quiz'
			);
		}
	}
}
