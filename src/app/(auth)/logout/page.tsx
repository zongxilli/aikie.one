'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

const LogoutPage = () => {
	const router = useRouter();
	useEffect(() => {
		setTimeout(() => router.push('/signup'), 2000);
	}, [router]);
	return <div>You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;
