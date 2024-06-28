import { devtools } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { UserProfile } from '@/app/types/users';
import { getUserProfile } from '@/lib/userActions';

import { createClient } from '../../utils/supabase/client';

export type UserState = {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
};

export type UserActions = {
	loadCurrentUser: (userId: string) => Promise<void>;
	updateUser: (updatedUser: Partial<UserProfile>) => void;
	subscribeToUserChanges: (userId: string) => () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
	return {
		user: null,
		isLoading: false,
		error: null,
	};
};

export const defaultInitState: UserState = {
	user: null,
	isLoading: false,
	error: null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
	return createStore<UserStore>()(
		devtools(
			(set) => ({
				...initState,
				loadCurrentUser: async (userId: string) => {
					set({ isLoading: true, error: null });
					try {
						const user = await getUserProfile(userId);
						set({ user, isLoading: false });
					} catch (error) {
						set({
							error: (error as Error).message,
							isLoading: false,
						});
					}
				},
				updateUser: (updatedUser: Partial<UserProfile>) => {
					set((state) => ({
						user: state.user
							? { ...state.user, ...updatedUser }
							: null,
					}));
				},
				subscribeToUserChanges: (userId: string) => {
					const supabase = createClient();
					const subscription = supabase
						.channel(`public:users:id=eq.${userId}`)
						.on(
							'postgres_changes',
							{
								event: 'UPDATE',
								schema: 'public',
								table: 'users',
								filter: `id=eq.${userId}`,
							},
							(payload) => {
								set((state) => ({
									user: state.user
										? { ...state.user, ...payload.new }
										: null,
								}));
							}
						)
						.subscribe();

					return () => {
						supabase.removeChannel(subscription);
					};
				},
			}),
			{
				name: 'users',
			}
		)
	);
};
