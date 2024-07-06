import { NextResponse } from 'next/server';

import { db } from '@/db/index';
import { messages } from '@/db/schema';

export const maxDuration = 60; // 设置最大持续时间为 60 秒
export const dynamic = 'force-dynamic'; // 确保路由是动态的

export async function POST(request: Request) {
	const { sessionId, content, api, temperature, system } =
		await request.json();

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

		// 触发后台任务
		await fetch(new URL('/api/process-chat', request.url), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sessionId, api, temperature, system }),
		});

		return NextResponse.json(
			{ message: 'Message received, processing started', userMessage },
			{ status: 202 }
		);
	} catch (error) {
		console.error('Error in chat handler:', error);
		return NextResponse.json(
			{ message: 'An error occurred while processing your request' },
			{ status: 500 }
		);
	}
}
