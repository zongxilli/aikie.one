'use client';

import { useEffect, useState } from 'react';

import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { createClient } from '../../supabase/client';

export default function useSupabase() {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setUser(session?.user ?? null);

			// 处理sign out后的 redirect action
			if (event === 'SIGNED_OUT') {
				router.push('/login');
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth, router]);

	return { supabase, user, session };
}
