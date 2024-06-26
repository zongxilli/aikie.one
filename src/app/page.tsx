'use client';

import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { useThemeToggle } from '@/hooks';

export default function Home() {
	const themeToggle = useThemeToggle();
	const { data: session } = useSession();

	return (
		<div>
			<Button onClick={themeToggle}>change theme</Button>
			{session && (
				<div className='flex flex-col items-center gap-2'>
					<h1>Welcome back {session.user?.name}</h1>
					{session.user?.image && (
						<Image
							width='20'
							height='20'
							src={session.user?.image}
							alt='user image'
						/>
					)}
					<Button onClick={() => signOut()}>Log out</Button>
					<p>{JSON.stringify(session)}</p>
				</div>
			)}
			{!session && (
				<div className='flex flex-col items-center gap-2'>
					<h1>You are not signed in</h1>
					<Button onClick={() => signIn('google')}>
						Sign in with Google
					</Button>
					<Button onClick={() => signIn('github')}>
						Sign in with Github
					</Button>
				</div>
			)}
		</div>
	);
}
