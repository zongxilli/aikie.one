'use client';

import React from 'react';

import { LogOut, UserRoundCog } from 'lucide-react';
import Link from 'next/link';

import { useSupabase } from '@/hooks';
import { useUserStore } from '@/providers/user';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const UserProfileButton = () => {
	const { supabase } = useSupabase();

	const { user } = useUserStore((state) => state);

	const renderPopoverContent = () => (
		<PopoverContent className='flex flex-col gap-4'>
			<div className='flex gap-4'>
				<Avatar className='h-12 w-12'>
					<AvatarImage src={user?.image || undefined} />
					<AvatarFallback>
						{user?.name?.slice(0, 2).toUpperCase() || 'U'}
					</AvatarFallback>
				</Avatar>

				<div className='flex flex-col items-start justify-between'>
					<p className='text-one-line cursor-default'>
						{user?.name || 'User'}
					</p>
					<p className='text-one-line text-gray cursor-default text-sm'>
						{user?.email || 'No email'}
					</p>
				</div>
			</div>

			<div className='flex flex-col'>
				<Link href='/account'>
					<Button
						variant='ghost'
						className='w-full flex justify-start items-center gap-4'
					>
						<UserRoundCog className='w-4 h-4' />
						Account Settings
					</Button>
				</Link>
				<Button
					variant='ghost'
					className='w-full flex justify-start items-center gap-4'
					onClick={() => supabase.auth.signOut()}
				>
					<LogOut className='w-4 h-4' />
					Sign out
				</Button>
			</div>
		</PopoverContent>
	);

	return (
		<Popover>
			<PopoverTrigger>
				<div className='border-gradient rounded-full'>
					<Avatar className='h-7 w-7'>
						<AvatarImage src={user?.image || undefined} />
						<AvatarFallback>
							{user?.name?.slice(0, 2).toUpperCase() || 'U'}
						</AvatarFallback>
					</Avatar>
				</div>
			</PopoverTrigger>
			{renderPopoverContent()}
		</Popover>
	);
};

export default UserProfileButton;
