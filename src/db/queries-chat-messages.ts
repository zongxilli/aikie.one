'use server';

import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

import { getClaudeResponse } from './anthropic/api';
import { getOpenAIResponsive } from './openAI/api';
import { AIProvider } from '@/types/AI';

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

		// 获取会话历史
		const sessionHistory = await getSessionMessages(sessionId);

		if (api === AIProvider.anthropic) {
			await getClaudeResponse(
				sessionId,
				sessionHistory,
				temperature,
				system
			);
		}
		// open AI
		else {
			await getOpenAIResponsive(
				sessionId,
				sessionHistory,
				temperature,
				system
			);
		}

		return [userMessage];
	} catch (error) {
		throw new Error('Failed to create new chat message');
	}
}
