'use server';

import OpenAI from 'openai';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.OPENAI_ORGANIZATION_ID,
	project: process.env.OPENAI_PROJECT_ID,
});

export const getOpenAIResponsive = async (
	sessionId: string,
	sessionHistory: Message[],
	temperature: number,
	system: string,
	storeResponseToDB: boolean
): Promise<string> => {
	try {
		if (!sessionId) {
			throw new Error('Session ID and content are required');
		}

		// 准备 OpenAI API 请求
		const chatCompletion = await openai.chat.completions.create({
			model: 'gpt-4o',
			temperature: temperature,
			// top_p: 0.1, // 较低的值会限制词汇选择，可能加快生成
			messages: [
				...sessionHistory.map((msg) => ({
					role: msg.role as 'user' | 'assistant',
					content: msg.content as string,
				})),
				{ role: 'system', content: system },
			],
			max_tokens: 2000,
		});

		// 获取 AI 回复
		const aiResponse = chatCompletion.choices[0].message.content!;

		if (storeResponseToDB) {
			// 插入 AI 回复到数据库
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [aiMessage] = await db
				.insert(messages)
				.values({
					session_id: sessionId as string,
					content: aiResponse as string,
					role: 'assistant',
				})
				.returning();
		}

		return aiResponse;
	} catch (error) {
		throw new Error('Failed to fetch response from Claude API');
	}
};

export const getSessionNameFromOpenAI = async (
	sessionHistory: Message[]
): Promise<string> => {
	try {
		if (sessionHistory.length === 0) {
			throw new Error('Cannot generate name for empty session history');
		}

		const prompt = `Generate a concise, engaging title (5-7 words) for this chat session. 
    Respond ONLY with the title, without quotes or any additional text.`;

		// 准备 OpenAI API 请求
		const chatCompletion = await openai.chat.completions.create({
			model: 'gpt-4o',
			temperature: 0.7,
			messages: [
				...sessionHistory.map((msg) => ({
					role: msg.role as 'user' | 'assistant',
					content: msg.content as string,
				})),
				{ role: 'user', content: prompt },
			],
			max_tokens: 2000,
		});

		// 获取 AI 回复
		const aiResponse = chatCompletion.choices[0].message.content!;

		return aiResponse;
	} catch (error) {
		throw new Error('Failed to fetch response from Claude API');
	}
};
