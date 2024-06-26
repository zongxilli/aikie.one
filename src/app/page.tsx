'use client';

import { Button } from '@/components/ui/button';
import { useThemeToggle } from '@/hooks';

export default function Home() {
	const themeToggle = useThemeToggle();

	return (
		<div>
			<Button onClick={themeToggle}>change theme</Button>
		</div>
	);
}
