'use client';

import Image from 'next/image';
import Link from 'next/link';

import logo from '@/../public/logo.svg';

const Logo = () => {
	return (
		<Link href='/home'>
			<div className='flex items-center gap-2 cursor-pointer'>
				<Image src={logo} alt='logo' className='w-10 h-10' />
				<div className='text-xl'>Kenny</div>
			</div>
		</Link>
	);
};

export default Logo;
