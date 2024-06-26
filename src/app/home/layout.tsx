'use client';

import { ReactNode } from 'react';

export default function HomeLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className='w-[100vw] h-[100dvh]'>
			<div className='w-full h-full flex items-center justify-center'>
				{children}
			</div>
		</main>
	);
}
