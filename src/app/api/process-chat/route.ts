import { NextResponse } from 'next/server';

import { getClaudeResponse } from '@/db/anthropic/api';
import { getOpenAIResponsive } from '@/db/openAI/api';
import { getSessionMessages } from '@/db/queries-chat-messages';
import { AIProvider } from '@/types/AI';

export const maxDuration = 60; // 设置最大持续时间为 60 秒
export const dynamic = 'force-dynamic'; // 确保路由是动态的

export async function POST(request: Request) {
	const { sessionId, api, temperature, system } = await request.json();

	try {
		const sessionHistory = await getSessionMessages(sessionId);

		if (api === AIProvider.anthropic) {
			await getClaudeResponse(
				sessionId,
				sessionHistory,
				temperature,
				system,
				true
			);
		} else {
			await getOpenAIResponsive(
				sessionId,
				sessionHistory,
				temperature,
				system,
				true
			);
		}

		return NextResponse.json({ message: 'Processing completed' });
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error in processChat:', error);
		return NextResponse.json(
			{ message: 'An error occurred while processing the chat' },
			{ status: 500 }
		);
	}
}
