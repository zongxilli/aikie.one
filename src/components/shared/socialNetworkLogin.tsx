'use client';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithGitHub } from '@/lib/authActions';

const SocialNetworkLogin = () => {
	return (
		<div className='flex flex-col items-center gap-2'>
			<Button
				type='button'
				variant='outline'
				className='w-full flex items-center gap-2'
				onClick={() => {
					signInWithGoogle();
				}}
			>
				<FcGoogle className='w-5 h-5' />
				Continue with Google
			</Button>
			<Button
				type='button'
				variant='outline'
				className='w-full flex items-center gap-2'
				onClick={() => {
					signInWithGitHub();
				}}
			>
				<FaGithub className='w-5 h-5' />
				Continue with Github
			</Button>
		</div>
	);
};

export default SocialNetworkLogin;
