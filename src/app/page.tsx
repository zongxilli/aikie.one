'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useThemeToggle } from '@/hooks';
import { useUserStore } from '@/providers/user';

export default function RootPage() {
	const themeToggle = useThemeToggle();

	const { user: storeUser } = useUserStore((state) => state);

	return (
		<div>
			<Button onClick={themeToggle}>change theme</Button>
			<Link href='/home'>Home</Link>
			{storeUser?.name}
		</div>
	);
}
