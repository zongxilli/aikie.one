'use client';

import { LogInLogOutButton } from '@/components/shared';
import { Button } from '@/components/ui/button';
import UserGreetText from '@/components/userGreetingText';
import { useThemeToggle } from '@/hooks';

export default function RootPage() {
	const themeToggle = useThemeToggle();

	return (
		<div>
			<UserGreetText />
			<Button onClick={themeToggle}>change theme</Button>
			<LogInLogOutButton />
		</div>
	);
}
