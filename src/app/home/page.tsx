'use client';

import { useSupabase } from '@/hooks';

export default function DashboardPage() {
	const { user, supabase } = useSupabase();

	return (
		<div>
			<h1>Welcome, {user?.email}</h1>
			<button
				onClick={() => {
					supabase.auth.signOut();
				}}
			>
				Log out
			</button>
		</div>
	);
}
