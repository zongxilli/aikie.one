import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.OPENAI_ORGANIZATION_ID,
	project: process.env.OPENAI_PROJECT_ID,
});

export const handler = async (event) => {
	try {
		const { sessionId, sessionHistory, temperature, system } = JSON.parse(
			event.body
		);

		const chatCompletion = await openai.chat.completions.create({
			model: 'gpt-4o',
			temperature: temperature,
			// top_p: 0.1, // 较低的值会限制词汇选择，可能加快生成
			messages: [
				...sessionHistory.map((msg) => ({
					role: msg.role,
					content: msg.content,
				})),
				{ role: 'user', content: system },
			],
			max_tokens: 1000,
		});

		const aiResponse = chatCompletion.choices[0].message.content;

		// 插入 AI 回复到数据库
		const { data, error } = await supabase
			.from('messages')
			.insert({
				session_id: sessionId,
				content: aiResponse,
				role: 'assistant',
			})
			.select();

		if (error) throw error;

		return {
			statusCode: 200,
			body: JSON.stringify({ message: data[0] }),
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to process request' }),
		};
	}
};
