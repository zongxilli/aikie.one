'use client';

import {
	USER_IMAGE_STORAGE_BUCKET,
	USER_IMAGE_STORAGE_BUCKET_FOLDER,
} from '@/app/types/users';

import { createClient } from '../../utils/supabase/client';

export async function updateUserImage(userId: string, file: File) {
	const supabase = createClient();

	// 首先获取用户当前的头像 url
	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('image')
		.eq('id', userId)
		.single();

	if (userError) {
		throw new Error(`Failed to get user data: ${userError.message}`);
	}

	if (userData && userData.image) {
		// 如果存在旧的头像，且是 Supabase 存储的图片，则尝试删除它
		if (userData.image.includes('supabase.co/storage')) {
			// 从完整 url 中提取文件路径
			const fileName =
				USER_IMAGE_STORAGE_BUCKET_FOLDER +
				'/' +
				userData.image.split('/').pop();

			const { error: deleteError } = await supabase.storage
				.from(USER_IMAGE_STORAGE_BUCKET)
				.remove([fileName]);

			// 删除失败不应该阻止图片更新，所以这里只 console error
			if (deleteError) {
				// eslint-disable-next-line no-console
				console.error(
					`Failed to delete old avatar: ${deleteError.message}`
				);
			}
		}
	}

	const fileName = `${userId}-${Date.now()}`;
	const fileLocation =
		USER_IMAGE_STORAGE_BUCKET + '/' + USER_IMAGE_STORAGE_BUCKET_FOLDER;

	// 上传图片到 storage
	const { error: uploadError } = await supabase.storage
		.from(fileLocation)
		.upload(fileName, file, {
			cacheControl: '3600',
			upsert: false,
		});

	if (uploadError) {
		throw new Error(`Failed to upload avatar: ${uploadError.message}`);
	}

	// 取回上传成功的图片 url
	const { data } = supabase.storage.from(fileLocation).getPublicUrl(fileName);

	const publicUrl = data.publicUrl;

	// 更新用户头像 url
	const { error: updateError } = await supabase
		.from('users')
		.update({ image: publicUrl })
		.eq('id', userId);

	if (updateError) {
		throw new Error(`Failed to update user avatar: ${updateError.message}`);
	}

	return publicUrl;
}
