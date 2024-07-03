'use server';

import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { Message, messages } from '@/db/schema';

export async function getSessionMessages(
	sessionId: string
): Promise<Message[]> {
	try {
		const sessionMessages = await db
			.select()
			.from(messages)
			.where(eq(messages.session_id, sessionId))
			.orderBy(desc(messages.created_at));

		return sessionMessages;
	} catch (error) {
		console.error('Failed to fetch chat messages:', error);
		throw new Error('Failed to fetch chat messages');
	}
}
