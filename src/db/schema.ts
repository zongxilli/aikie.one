import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	varchar,
	timestamp,
	uuid,
	index,
	pgEnum,
	integer,
	jsonb,
} from 'drizzle-orm/pg-core';

import { QuizQuestions } from '@/types/quiz';

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		name: varchar('name', { length: 255 }).notNull(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		avatar_url: text('avatar_url'),
		full_name: varchar('full_name', { length: 255 }).notNull(),
		created_at: timestamp('created_at').defaultNow().notNull(),
		updated_at: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: index('users_email_idx').on(table.email),
		nameIdx: index('users_name_idx').on(table.name),
	})
);

export const chatSessions = pgTable(
	'chat_sessions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		created_at: timestamp('created_at').defaultNow().notNull(),
		updated_at: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('chat_sessions_user_id_idx').on(table.user_id),
		createdAtIdx: index('chat_sessions_created_at_idx').on(
			table.created_at
		),
	})
);

// Enum
export type MessageRole = 'user' | 'assistant';
export const messageRolePG = pgEnum('role_enum', ['user', 'assistant']);

export const messages = pgTable(
	'messages',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		session_id: uuid('session_id')
			.notNull()
			.references(() => chatSessions.id, { onDelete: 'cascade' }),
		content: text('content').notNull(),
		role: messageRolePG('role').notNull(),
		created_at: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		sessionIdIdx: index('messages_session_id_idx').on(table.session_id),
		createdAtIdx: index('messages_created_at_idx').on(table.created_at),
	})
);

// Quiz table
export const quizzes = pgTable(
	'quizzes',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		name: varchar('name', { length: 255 }).notNull(),
		description: text('description').notNull(),
		questions: jsonb('questions').$type<QuizQuestions>().notNull(),
		total_points: integer('total_points').notNull(),
		total_time: integer('total_time').notNull(), // 新增字段：总时间（秒）
		created_at: timestamp('created_at').defaultNow().notNull(),
		updated_at: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		userIdIdx: index('quizzes_user_id_idx').on(table.user_id),
		createdAtIdx: index('quizzes_created_at_idx').on(table.created_at),
		nameIdx: index('quizzes_name_idx').on(table.name),
	})
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	chatSessions: many(chatSessions),
	quizzes: many(quizzes),
}));

export const chatSessionsRelations = relations(
	chatSessions,
	({ one, many }) => ({
		user: one(users, {
			fields: [chatSessions.user_id],
			references: [users.id],
		}),
		messages: many(messages),
	})
);

export const messagesRelations = relations(messages, ({ one }) => ({
	chatSession: one(chatSessions, {
		fields: [messages.session_id],
		references: [chatSessions.id],
	}),
}));

export const quizzesRelations = relations(quizzes, ({ one }) => ({
	user: one(users, {
		fields: [quizzes.user_id],
		references: [users.id],
	}),
}));

// Types
export type UserProfile = typeof users.$inferSelect;
export type NewUserProfile = typeof users.$inferInsert;

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;

// Constants
export const USER_IMAGE_STORAGE_BUCKET = 'my-next';
export const USER_IMAGE_STORAGE_BUCKET_FOLDER = 'user-images';
