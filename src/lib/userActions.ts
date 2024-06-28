'use server';

import { UserProfile } from '@/app/types/users';

import { createClient } from '../../utils/supabase/server';

export async function getUserProfile(userId: string): Promise<UserProfile> {
	const supabase = createClient();

	let { data: profiles, error } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single();

	if (error) {
		throw new Error(`Failed to get user profile: ${error.message}`);
	}

	return profiles;
}

export async function updateUserProfile(
	userId: string,
	name: string,
	email: string,
	image?: string
) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from('users')
		.update({ name: name, email: email, image: image })
		.eq('id', userId);

	if (error) {
		throw new Error(`Failed to update user: ${error.message}`);
	}

	return data;
}
