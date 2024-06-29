'use client';

import { useState } from 'react';

import { Settings, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

import Danger from './components/danger';
import General from './components/general';

export default function AccountPage() {
	const [tab, setTab] = useState(0);

	const renderSideBar = () => {
		return (
			<div className='w-20 md:w-64 shrink-0 flex flex-col text-sm text-muted-foreground'>
				<Button
					className='flex justify-center items-center gap-4 px-1 md:px-6 md:justify-start'
					variant='ghost'
					selected={tab === 0}
					onClick={() => setTab(0)}
				>
					<Settings className='w-4 h-4 hidden md:block' />
					General
				</Button>
				<Button
					className='flex justify-center items-center gap-4 px-1 md:px-6 md:justify-start'
					variant='ghost'
					selected={tab === 1}
					onClick={() => setTab(1)}
				>
					<TriangleAlert className='w-4 h-4 hidden md:block' />
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
				return <Danger />;
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
