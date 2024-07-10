import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import appBg from '@/../public/app-bg.jpg';
import logo from '@/../public/logo.svg';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { UserAuthForm } from './components/userAuthForm';

export const metadata: Metadata = {
	title: 'Sign up',
	description: 'Authentication forms',
};

export default function SignUpPage() {
	return (
		<>
			<div className='container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
				<Link
					href='/login'
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						'absolute right-4 top-4 md:right-8 md:top-8'
					)}
				>
					Login
				</Link>
				<div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
					<Image
						src={appBg}
						alt='Signup background'
						fill
						sizes='auto'
						style={{ objectFit: 'cover' }}
						quality={100}
						priority
					/>
					<div className='relative z-20 flex items-center gap-2 text-lg font-medium'>
						<Image
							src={logo}
							alt='logo'
							width='20'
							height='20'
							className='w-10 h-10'
						/>
					</div>
					<div className='relative z-20 mt-auto'>
						<blockquote className='space-y-2'>
							<p className='text-lg'>
								&ldquo;Unlock the superpower of Artificial
								intelligence (AI)&rdquo;
							</p>
							<footer className='text-sm'>By AIkie</footer>
						</blockquote>
					</div>
				</div>
				<div className='lg:p-8'>
					<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
						<div className='flex flex-col space-y-2 text-center'>
							<h1 className='text-2xl font-semibold tracking-tight'>
								Create an account
							</h1>
							<p className='white text-sm text-muted-foreground'>
								Enter your email below to create your account
							</p>
						</div>
						<UserAuthForm />
						<p className='px-8 text-center text-sm text-muted-foreground'>
							By clicking continue, you agree to our{' '}
							<Link
								href='/terms'
								className='underline underline-offset-4 hover:text-primary'
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href='/privacy'
								className='underline underline-offset-4 hover:text-primary'
							>
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
