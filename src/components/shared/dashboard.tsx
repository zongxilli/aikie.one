'use client';

import { PropsWithChildren, useState } from 'react';

import { Home, LucideIcon, UserRoundCog } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import logo from '../../../public/logo.svg';
import { Button } from '../ui/button';

import Header from './header';

const Dashboard = ({ children }: PropsWithChildren<{}>) => {
	const pathname = usePathname();

	const [isExpanded, setIsExpanded] = useState(false);

	const renderSideBarItem = (
		Icon: LucideIcon,
		label: string,
		href: string
	) => (
		<Link href={href} className='w-full'>
			<Button
				variant='ghost'
				selected={pathname === href}
				className={`${isExpanded ? 'w-full' : 'w-full'} transition-all
				px-[0.6rem]
				flex justify-start items-center gap-4
				`}
			>
				<Icon className='h-4 w-4 min-w-[1.25rem]' />
				<div
					className={`${
						isExpanded ? 'opacity-100' : 'opacity-0'
					} transition-all`}
				>
					{label}
				</div>
			</Button>
		</Link>
	);

	const renderSideBar = () => {
		return (
			<aside
				className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r bg-background transition-all ease-in-out ${
					isExpanded ? 'w-64' : 'w-[3.5rem]'
				}`}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setIsExpanded(false)}
			>
				<nav className='w-full h-full flex flex-col justify-between px-2 pt-3 pb-6'>
					<div className='w-full flex-grow flex flex-col justify-start gap-1'>
						<Link href='/' className='pb-4 pl-1'>
							<Image
								alt='new logo'
								src={logo}
								className='h-8 w-8'
							/>
						</Link>

						{renderSideBarItem(Home, 'Dashboard', '/home')}
					</div>

					{renderSideBarItem(
						UserRoundCog,
						'Account Settings',
						'/account'
					)}
				</nav>
			</aside>
		);
	};

	const renderContent = () => {
		return (
			<div className='w-[calc(100%_-_3.5rem)] h-full fixed top-0 left-[3.5rem] flex flex-col'>
				<header className='flex-shrink-0 px-5 py-2 h-16'>
					<Header />
				</header>
				<main className='flex-grow w-full overflow-auto flex flex-col '>
					{children}
				</main>
			</div>
		);
	};

	return (
		<div className='flex min-h-screen w-full'>
			{renderSideBar()}
			{renderContent()}
		</div>
	);
};

export default Dashboard;
