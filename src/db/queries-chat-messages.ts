'use server';

import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';
import { AIProvider } from '@/types/AI';

import { getClaudeResponse } from './anthropic/api';
import { getOpenAIResponsive } from './openAI/api';

export async function getSessionMessages(
	sessionId: string
): Promise<Message[]> {
	try {
		const sessionMessages = await db
			.select()
			.from(messages)
			.where(eq(messages.session_id, sessionId))
			.orderBy(asc(messages.created_at));

		return sessionMessages;
	} catch (error) {
		throw new Error('Failed to fetch chat messages');
	}
}

export async function createNewChatMessage(
	sessionId: string,
	content: string,
	api: AIProvider,
	temperature: number,
	system: string
): Promise<Message[]> {
	try {
		if (!sessionId || !content) {
			throw new Error('Session ID and content are required');
		}

		// 插入用户消息
		const [userMessage] = await db
			.insert(messages)
			.values({
				session_id: sessionId as string,
				content: content as string,
				role: 'user',
			})
			.returning();

		const sessionHistory = await getSessionMessages(sessionId);

		// claude 3.5 sonnet
		if (api === AIProvider.anthropic) {
			await getClaudeResponse(
				sessionId,
				sessionHistory,
				temperature,
				system,
				true
			);
		}

		// chat GPT 4o
		else {
			await getOpenAIResponsive(
				sessionId,
				sessionHistory,
				temperature,
				system,
				true
			);
		}

		return [userMessage];
	} catch (error) {
		throw new Error('Failed to create new chat message');
	}
}
