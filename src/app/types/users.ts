export type UserProfile = {
	id: string;
	name: string;
	email: string;
	image: string;
};

export type UserProfileFields = keyof UserProfile;

export const DEFAULT_USER_PROFILE: UserProfile = {
	id: '',
	name: '',
	email: '',
	image: '',
};

export const USER_IMAGE_STORAGE_BUCKET = 'my-next';

export const USER_IMAGE_STORAGE_BUCKET_FOLDER = 'user-images';
