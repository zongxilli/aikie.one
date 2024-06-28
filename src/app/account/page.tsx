'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import General from './components/general';

export default function AccountPage() {
	const [tab, setTab] = useState(0);

	const renderSideBar = () => {
		return (
			<div className='w-20 md:w-40 flex flex-col text-sm text-muted-foreground'>
				<Button
					className='flex justify-start'
					variant='ghost'
					onClick={() => setTab(0)}
				>
					General
				</Button>
				<Button
					className='flex justify-start'
					variant='ghost'
					onClick={() => setTab(1)}
				>
					Danger
				</Button>
			</div>
		);
	};

	const renderContent = () => {
		switch (tab) {
			case 0:
				return <General />;

			case 1:
				return <div>placeholder</div>;
		}
	};

	return (
		<main className='container h-full flex flex-col gap-4 p-4 md:gap-8 md:p-10'>
			<h1 className='text-3xl font-semibold'>Settings</h1>
			<div className='w-full flex items-start justify-between gap-2 md:gap-6'>
				{renderSideBar()}
				{renderContent()}
			</div>
		</main>
	);
}
