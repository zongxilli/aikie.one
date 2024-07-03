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
		throw new Error('Failed to fetch chat messages');
	}
}

export async function createNewChatMessage(
	sessionId: string,
	content: string,
	role: 'user' | 'assistant' = 'user'
): Promise<Message> {
	try {
		const [newMessage] = await db
			.insert(messages)
			.values({
				session_id: sessionId,
				content,
				role,
			})
			.returning();

		return newMessage;
	} catch (error) {
		throw new Error('Failed to create new chat message');
	}
}
