'use client';

import { ReactNode } from 'react';

import { Header } from '@/components/shared';

export default function HomeLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className='w-[100vw] h-[100dvh]'>
			<Header />
			<div className='w-full h-[calc(100dvh_-_3.5rem)] flex items-center justify-center'>
				{children}
			</div>
		</main>
	);
}
