'use server';

import { asc, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';
import { callLambdaWithoutWaiting } from '@/lib/callLambdaWithoutWaiting';
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

		if (api === AIProvider.anthropic) {
			callLambdaWithoutWaiting(
				process.env.LAMBDA_ANTHROPIC_HANDLER_FUNCTION_URL!,
				{
					sessionId,
					sessionHistory,
					temperature,
					system,
					stage: process.env.NEXT_APP_STAGE,
				}
			);
		}

		// open AI
		else {
			callLambdaWithoutWaiting(
				process.env.LAMBDA_OPENAI_HANDLER_FUNCTION_URL!,
				{
					sessionId,
					sessionHistory,
					temperature,
					system,
					stage: process.env.NEXT_APP_STAGE,
				}
			);
		}

		return [userMessage];
	} catch (error) {
		throw new Error('Failed to create new chat message');
	}
}
