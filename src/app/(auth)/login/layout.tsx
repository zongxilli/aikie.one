'use client';

import { ReactNode } from 'react';

export default function LoginLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <main className='w-[100vw] h-[100dvh]'>{children}</main>;
}
