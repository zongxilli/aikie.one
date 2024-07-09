'use server';

import { desc, eq, and, like } from 'drizzle-orm';

import { db } from '@/db/index';
import { ChatSession, Message, chatSessions } from '@/db/schema';
import { AIProvider } from '@/types/AI';

import { getSessionNameFromClaude } from './anthropic/api';
import { getSessionNameFromOpenAI } from './openAI/api';

export async function getUserChatSessions(
	userId: string
): Promise<ChatSession[]> {
	try {
		const sessions = await db
			.select()
			.from(chatSessions)
			.where(eq(chatSessions.user_id, userId))
			.orderBy(desc(chatSessions.updated_at));

		return sessions;
	} catch (error) {
		throw new Error('Failed to fetch chat sessions');
	}
}

export async function deleteChatSession(
	sessionId: string,
	userId: string
): Promise<{ success: boolean; message: string }> {
	try {
		// 首先验证会话属于该用户
		const session = await db
			.select()
			.from(chatSessions)
			.where(
				and(
					eq(chatSessions.id, sessionId),
					eq(chatSessions.user_id, userId)
				)
			)
			.limit(1);

		if (session.length === 0) {
			return {
				success: false,
				message:
					'Chat session not found or you do not have permission to delete it.',
			};
		}

		await db.delete(chatSessions).where(eq(chatSessions.id, sessionId));

		return { success: true, message: 'Chat session successfully deleted.' };
	} catch (error) {
		return { success: false, message: 'Failed to delete chat session.' };
	}
}

export async function updateChatSessionName(
	sessionId: string,
	userId: string,
	newName: string
) {
	try {
		const uniqueName = await generateUniqueName(userId, newName);

		await db
			.update(chatSessions)
			.set({ name: uniqueName })
			.where(
				and(
					eq(chatSessions.id, sessionId),
					eq(chatSessions.user_id, userId)
				)
			);
		return {
			success: true,
			message: 'Chat session name updated successfully.',
		};
	} catch (error) {
		return {
			success: false,
			message: 'Failed to update chat session name.',
		};
	}
}

export async function generateUniqueName(
	userId: string,
	baseName: string
): Promise<string> {
	let name = baseName;
	let counter = 0;

	while (true) {
		const existingSessions = await db
			.select()
			.from(chatSessions)
			.where(
				and(
					eq(chatSessions.user_id, userId),
					like(
						chatSessions.name,
						counter === 0 ? baseName : `${baseName} (${counter})`
					)
				)
			);

		if (existingSessions.length === 0) {
			return name;
		}

		counter++;
		name = `${baseName} (${counter})`;
	}
}

export async function createNewChatSession(
	userId: string
): Promise<ChatSession> {
	try {
		const name = 'Untitled conversation';

		const [newSession] = await db
			.insert(chatSessions)
			.values({
				user_id: userId,
				name: name,
			})
			.returning();

		if (!newSession) {
			throw new Error('Failed to create new session');
		}

		return newSession;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to create new session: ${error.message}`);
		} else {
			throw new Error(
				'An unexpected error occurred while creating new session'
			);
		}
	}
}

export async function generateSessionName(
	api: AIProvider,
	sessionHistory: Message[]
): Promise<string> {
	let newName: string;

	if (api === AIProvider.anthropic) {
		const response = await getSessionNameFromClaude(sessionHistory);

		newName = response;
	} else {
		const response = await getSessionNameFromOpenAI(sessionHistory);

		newName = response;
	}

	return newName
		.replace(/^["']|["']$/g, '')
		.trim()
		.substring(0, 100);
}
