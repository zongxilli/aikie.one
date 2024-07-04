import Anthropic from '@anthropic-ai/sdk';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const getClaudeResponse = async (
	sessionId: string,
	sessionHistory: Message[]
) => {
	try {
		if (!sessionId) {
			throw new Error('Session ID is required');
		}

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20240620',
			max_tokens: 2000,
			temperature: 0.7, // 调整温度以改变响应的创造性
			system: 'You are a software engineer', // 修改系统提示
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

		// example response
		// {
		//   id: 'msg_01YS4NngSjApWBR4zSE9yXJv',
		//   type: 'message',
		//   role: 'assistant',
		//   model: 'claude-3-5-sonnet-20240620',
		//   content: [
		//     {
		//       type: 'text',
		//       text: 'React 和 Vue 都是流行的前端JavaScript框架,它们有一些相似之处,但也存在一些重要区别。以下是它们的主要区别:\n' +
		//         '\n' +
		//         '1. 模板语法:\n' +
		//         '   - React 使用 JSX,将 HTML 直接写在 JavaScript 中。\n' +
		//     }
		//   ],
		//   stop_reason: 'end_turn',
		//   stop_sequence: null,
		//   usage: { input_tokens: 21, output_tokens: 617 }
		// }

		if (response.content[0] && 'text' in response.content[0]) {
			const aiResponse = response.content[0].text;

			// 插入 AI 回复到数据库
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
