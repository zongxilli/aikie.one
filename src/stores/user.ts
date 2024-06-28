import { createStore } from 'zustand/vanilla';

import { UserProfile } from '@/app/types/users';
import { getUserProfile } from '@/lib/userActions';

export type UserState = {
	user: UserProfile | null;
	isLoading: boolean;
	error: string | null;
};

export type UserActions = {
	loadCurrentUser: (userId: string) => Promise<void>;
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
	return createStore<UserStore>()((set) => ({
		...initState,
		loadCurrentUser: async (userId: string) => {
			set({ isLoading: true, error: null });
			try {
				const user = await getUserProfile(userId);
				set({ user, isLoading: false });
			} catch (error) {
				set({ error: (error as Error).message, isLoading: false });
			}
		},
	}));
};
