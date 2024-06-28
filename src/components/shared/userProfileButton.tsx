'use client';

import React from 'react';

import { LogOut, UserRoundCog } from 'lucide-react';
import Link from 'next/link';

import { useSupabase, useUserProfile } from '@/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const UserProfileButton = () => {
	const { supabase } = useSupabase();
	const userProfile = useUserProfile();

	const renderPopoverContent = () => (
		<PopoverContent className='flex flex-col gap-4'>
			<div className='flex gap-4'>
				<Avatar className='h-12 w-12'>
					<AvatarImage src={userProfile?.image || undefined} />
					<AvatarFallback>
						{userProfile?.name?.slice(0, 2).toUpperCase() || 'U'}
					</AvatarFallback>
				</Avatar>

				<div className='flex flex-col items-start justify-between'>
					<p className='text-one-line cursor-default'>
						{userProfile?.name || 'User'}
					</p>
					<p className='text-one-line text-gray cursor-default text-sm'>
						{userProfile?.email || 'No email'}
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
						<AvatarImage src={userProfile?.image || undefined} />
						<AvatarFallback>
							{userProfile?.name?.slice(0, 2).toUpperCase() ||
								'U'}
						</AvatarFallback>
					</Avatar>
				</div>
			</PopoverTrigger>
			{renderPopoverContent()}
		</Popover>
	);
};

export default UserProfileButton;
