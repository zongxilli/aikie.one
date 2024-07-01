'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { users, UserProfile } from '@/db/schema';

export async function getUserProfile(userId: string): Promise<UserProfile> {
	const profile = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!profile.length) {
		throw new Error('Failed to get user profile: User not found');
	}

	return profile[0];
}

export async function updateUserProfile(
	userId: string,
	name: string,
	email: string
) {
	const updatedUser = await db
		.update(users)
		.set({ name, email })
		.where(eq(users.id, userId))
		.returning();

	if (!updatedUser.length) {
		throw new Error('Failed to update user: No user found');
	}

	return updatedUser[0];
}
