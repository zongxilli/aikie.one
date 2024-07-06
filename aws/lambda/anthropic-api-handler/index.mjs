import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
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
		} else {
			supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
			);
		}

		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20240620',
			max_tokens: 1000,
			temperature: temperature,
			system: system,
			messages: [
				{
					role: 'user',
					content: sessionHistory.map((msg) => ({
						type: 'text',
						text: msg.content,
					})),
				},
			],
		});

		if (response.content[0] && 'text' in response.content[0]) {
			const aiResponse = response.content[0].text;

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
		} else {
			throw new Error('Unexpected response format from Claude API');
		}
	} catch (error) {
		console.error('Error:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Failed to process request' }),
		};
	}
};
