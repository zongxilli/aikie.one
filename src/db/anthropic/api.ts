'use server';

import Anthropic from '@anthropic-ai/sdk';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getClaudeResponse = async (
	sessionId: string,
	sessionHistory: Message[],
	temperature: number,
	system: string
) => {
	try {
		if (!sessionId) {
			throw new Error('Session ID is required');
		}

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20240620',
			max_tokens: 500,
			temperature: temperature,
			// top_p: 0.1, // 较低的值会限制词汇选择，可能加快生成
			system: system,
			messages: [
				{
					role: 'user',
					content: [...sessionHistory].map((msg) => ({
						type: 'text',
						text: msg.content as string,
					})),
				},
			],
		});

		if (response.content[0] && 'text' in response.content[0]) {
			const aiResponse = response.content[0].text;

			// 插入 AI 回复到数据库
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [aiMessage] = await db
				.insert(messages)
				.values({
					session_id: sessionId as string,
					content: aiResponse,
					role: 'assistant',
				})
				.returning();
		} else {
			throw new Error('Unexpected response format from Claude API');
		}
	} catch (error) {
		throw new Error('Failed to fetch response from Claude API');
	}
};
