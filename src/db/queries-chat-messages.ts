'use server';

import { asc, eq } from 'drizzle-orm';
import OpenAI from 'openai';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

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
	role: 'user' | 'assistant' = 'user'
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
				role: role as 'user' | 'assistant',
			})
			.returning();

		// 如果是用户消息，则获取 AI 回复
		if (role === 'user') {
			// 获取会话历史
			const sessionHistory = await getSessionMessages(sessionId);

			// 准备 OpenAI API 请求
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					...sessionHistory.map((msg) => ({
						role: msg.role as 'user' | 'assistant', // 确保角色是 'user' 或 'assistant'
						content: msg.content as string,
					})),
					{ role: 'user', content: content as string },
				],
			});

			// 获取 AI 回复
			const aiResponse = chatCompletion.choices[0].message.content;

			// 插入 AI 回复到数据库
			const [aiMessage] = await db
				.insert(messages)
				.values({
					session_id: sessionId as string,
					content: aiResponse as string,
					role: 'assistant' as 'assistant',
				})
				.returning();

			return [userMessage, aiMessage];
		}

		return [userMessage];
	} catch (error) {
		throw new Error('Failed to create new chat message');
	}
}
