import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.OPENAI_ORGANIZATION_ID,
	project: process.env.OPENAI_PROJECT_ID,
});

export const handler = async (event) => {
	try {
		const { sessionId, sessionHistory, temperature, system, stage } =
			JSON.parse(event.body);

		let supabase;

		if (stage === 'production') {
			supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL_PRODUCTION,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PRODUCTION
			);
		}
		// development
		else {
			supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
			);
		}

		const body = {
			model: 'gpt-4o',
			temperature: temperature,
			// top_p: 0.1, // 较低的值会限制词汇选择，可能加快生成
			messages: [
				...sessionHistory.map((msg) => ({
					role: msg.role,
					content: msg.content,
				})),
			],
			max_tokens: 1000,
		};

		if (system !== '') {
			body.messages.push({ role: 'user', content: system });
		}

		const chatCompletion = await openai.chat.completions.create(body);

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
