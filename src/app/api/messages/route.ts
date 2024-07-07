import { NextResponse } from 'next/server';

import { db } from '@/db/index';
import {
	generateSessionName,
	updateChatSessionName,
} from '@/db/queries-chat-sessions';
import { messages } from '@/db/schema';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
	const {
		sessionId,
		content,
		api,
		temperature,
		system,
		isNewSession,
		userId,
	} = await request.json();

	if (!sessionId || !content) {
		return NextResponse.json(
			{ message: 'Session ID and content are required' },
			{ status: 400 }
		);
	}

	try {
		// 插入用户消息
		const [userMessage] = await db
			.insert(messages)
			.values({
				session_id: sessionId,
				content: content,
				role: 'user',
			})
			.returning();

		// 处理 AI 响应
		const processChatPromise = fetch(
			new URL('/api/process-chat', request.url),
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, api, temperature, system }),
			}
		).then((response) => {
			if (!response.ok) {
				throw new Error('Failed to process chat');
			}
			return response.json();
		});

		// 处理会话名称
		let sessionNewName: string | undefined;
		const generateNamePromise = isNewSession
			? generateSessionName(api, [userMessage]).then(async (name) => {
					sessionNewName = name;
					await updateChatSessionName(sessionId, userId, name);
			  })
			: Promise.resolve();

		// 并行执行任务
		await Promise.all([processChatPromise, generateNamePromise]);

		return NextResponse.json(
			{
				message: 'Message received, processing started',
				userMessage,
				sessionName: sessionNewName,
			},
			{ status: 202 }
		);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error in chat handler:', error);
		return NextResponse.json(
			{ message: 'An error occurred while processing your request' },
			{ status: 500 }
		);
	}
}
