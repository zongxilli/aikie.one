'use client';

import { useUserStore } from '@/providers/user';

export default function HomePage() {
	const { user, isLoading, error } = useUserStore((state) => state);

	return (
		<div>
			<div>{JSON.stringify(user)}</div>
			<div>{JSON.stringify(error)}</div>
			<div>{JSON.stringify(isLoading)}</div>
		</div>
	);
}
