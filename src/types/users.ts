export type UserProfile = {
	id: string;
	name: string;
	email: string;
	avatar_url: string;
	full_name: string;
};

export type UserProfileFields = keyof UserProfile;

export const DEFAULT_USER_PROFILE: UserProfile = {
	id: '',
	name: '',
	email: '',
	avatar_url: '',
	full_name: '',
};

export const USER_IMAGE_STORAGE_BUCKET = 'my-next';

export const USER_IMAGE_STORAGE_BUCKET_FOLDER = 'user-images';
