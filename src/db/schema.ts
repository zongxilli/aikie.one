import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	avatar_url: text('avatar_url'),
	full_name: varchar('full_name', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const USER_IMAGE_STORAGE_BUCKET = 'my-next';
export const USER_IMAGE_STORAGE_BUCKET_FOLDER = 'user-images';

export type UserProfile = typeof users.$inferSelect;
export type NewUserProfile = typeof users.$inferInsert;

export type UserProfileFields = keyof UserProfile;

// export const DEFAULT_USER_PROFILE: Partial<UserProfile> = {
// 	id: '',
// 	name: '',
// 	email: '',
// 	avatar_url: '',
// 	full_name: '',
// 	created_at: new Date(),
// 	updated_at: new Date(),
// };
