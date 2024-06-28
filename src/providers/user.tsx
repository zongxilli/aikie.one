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

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
	undefined
);

export interface UserStoreProviderProps {
	children: ReactNode;
	userId?: string;
}

export const UserStoreProvider = ({
	children,
	userId,
}: UserStoreProviderProps) => {
	const storeRef = useRef<UserStoreApi>();
	if (!storeRef.current) {
		storeRef.current = createUserStore(initUserStore());
	}

	// 新增: 使用 useEffect 在组件挂载时获取用户信息
	useEffect(() => {
		if (userId) {
			storeRef.current?.getState().loadCurrentUser(userId);
		}
	}, [userId]);

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
