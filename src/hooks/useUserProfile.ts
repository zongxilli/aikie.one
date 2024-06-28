'use client';

import { useEffect, useState } from 'react';

import { DEFAULT_USER_PROFILE, UserProfile } from '@/app/types/users';
import { getUserProfile } from '@/lib/userActions';

import useSupabase from './useSupabase';

export default function useUserProfile() {
	const { user, supabase } = useSupabase();
	const [userProfile, setUserProfile] =
		useState<UserProfile>(DEFAULT_USER_PROFILE);

	useEffect(() => {
		let subscription: any;

		const fetchUserProfile = async () => {
			if (user) {
				const profile = await getUserProfile(user.id);
				setUserProfile(profile);

				// 设置实时订阅
				subscription = supabase
					.channel(`public:users:id=eq.${user.id}`)
					.on(
						'postgres_changes',
						{
							event: 'UPDATE',
							schema: 'public',
							table: 'users',
							filter: `id=eq.${user.id}`,
						},
						(payload) => {
							// console.log('User profile updated:', payload);
							setUserProfile(payload.new as UserProfile);
						}
					)
					.subscribe();
			}
		};

		fetchUserProfile();

		// 清理函数
		return () => {
			if (subscription) {
				supabase.removeChannel(subscription);
			}
		};
	}, [user, supabase]);

	return userProfile;
}
