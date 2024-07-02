'use client';

import { ReactNode } from 'react';

import { Dashboard } from '@/components/shared';

export default function ChatLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className='w-[100vw] h-[100dvh]'>
			<Dashboard>{children}</Dashboard>
		</main>
	);
}
