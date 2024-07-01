'use client';

import {
	type ReactNode,
	createContext,
	useRef,
	useContext,
	useEffect,
} from 'react';

import { useStore } from 'zustand';

import { type UserStore, createUserStore, initUserStore } from '@/stores/user';

import { createClient } from '../../supabase/client';

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
	undefined
);

export interface UserStoreProviderProps {
	children: ReactNode;
	userId?: string;
}

export const UserStoreProvider = ({
	userId,
	children,
}: UserStoreProviderProps) => {
	const supabase = createClient();
	const storeRef = useRef<UserStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createUserStore(initUserStore());
	}

	useEffect(() => {
		const store = storeRef.current;

		const fetchAndSubscribeUser = async () => {
			let identification = userId;

			if (!identification) {
				const {
					data: { user },
				} = await supabase.auth.getUser();

				identification = user?.id;
			}

			if (identification !== undefined && store) {
				console.log('user provider 开始加载和监听用户');
				store.getState().loadCurrentUser(identification);
				const unsubscribe = store
					.getState()
					.subscribeToUserChanges(identification);

				return () => {
					unsubscribe();
				};
			}
		};

		if (store) {
			fetchAndSubscribeUser();
		}
	}, [supabase.auth, userId]);

	return (
		<UserStoreContext.Provider value={storeRef.current}>
			{children}
		</UserStoreContext.Provider>
	);
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
	const userStoreContext = useContext(UserStoreContext);

	if (!userStoreContext) {
		throw new Error('useUserStore must be used within UserStoreProvider');
	}

	return useStore(userStoreContext, selector);
};
