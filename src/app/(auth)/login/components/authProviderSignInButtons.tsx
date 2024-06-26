'use client';

import { Button } from '@/components/ui/button';
import { signInWithGoogle, signInWithGitHub } from '@/lib/authActions';

const AuthProviderSignInButtons = () => {
	return (
		<div className='flex flex-col items-center gap-1'>
			<Button
				type='button'
				variant='outline'
				className='w-full'
				onClick={() => {
					signInWithGoogle();
				}}
			>
				Continue with Google
			</Button>
			<Button
				type='button'
				variant='outline'
				className='w-full'
				onClick={() => {
					signInWithGitHub();
				}}
			>
				Continue with Github
			</Button>
		</div>
	);
};

export default AuthProviderSignInButtons;
