'use client';

import { UserProfile } from '@/app/types/users';

import { createClient } from '../../utils/supabase/client';

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
	email: string
) {
	const supabase = createClient();
	const { data, error } = await supabase
		.from('users')
		.update({ name: name, email: email })
		.eq('id', userId);

	if (error) {
		throw new Error(`Failed to update user: ${error.message}`);
	}

	return data;
}

export async function updateUserImage(userId: string, file: File) {
	const supabase = createClient();

	const fileName = `${userId}-${Date.now()}.jpg`;

	const { error: uploadError } = await supabase.storage
		.from('my-next/user-images')
		.upload(fileName, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (uploadError) {
		throw new Error(`Failed to upload avatar: ${uploadError.message}`);
	}

	const { data } = supabase.storage
		.from('my-next/user-images')
		.getPublicUrl(fileName);

	const publicUrl = data.publicUrl;

	// 更新用户头像 URL
	const { error: updateError } = await supabase
		.from('users')
		.update({ image: publicUrl })
		.eq('id', userId);

	if (updateError) {
		throw new Error(`Failed to update user avatar: ${updateError.message}`);
	}

	return publicUrl;
}

export async function deleteUserAccount(userId: string) {
	const supabase = createClient();

	const { data, error } = await supabase.auth.admin.deleteUser(userId);

	if (error) {
		throw new Error(`Failed to delete user: ${error.message}`);
	}

	return data;
}
