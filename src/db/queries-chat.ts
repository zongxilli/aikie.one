'use server';

import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { ChatSession, chatSessions } from '@/db/schema';

export async function getUserChatSessions(
	userId: string
): Promise<ChatSession[]> {
	try {
		const sessions = await db
			.select()
			.from(chatSessions)
			.where(eq(chatSessions.user_id, userId))
			.orderBy(desc(chatSessions.created_at));

		return sessions;
	} catch (error) {
		throw new Error('Failed to fetch chat sessions');
	}
}
