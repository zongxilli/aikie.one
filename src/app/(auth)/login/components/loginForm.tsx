import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/authActions';

import SocialNetworkLogin from '../../../../components/shared/socialNetworkLogin';

export default function LogInForm() {
	const renderDivider = () => (
		<div className='relative'>
			<div className='absolute inset-0 flex items-center'>
				<span className='w-full border-t' />
			</div>
			<div className='relative flex justify-center text-xs uppercase'>
				<span className='bg-background px-2 text-muted-foreground'>
					Or continue with
				</span>
			</div>
		</div>
	);

	return (
		<Card className='mx-auto max-w-sm'>
			<CardHeader>
				<CardTitle className='text-2xl'>Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action=''>
					<div className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='m@example.com'
								required
							/>
						</div>
						<div className='grid gap-2'>
							{/* <div className='flex items-center'>
								<Link
								href='#'
								className='ml-auto inline-block text-sm underline'
								>
								Forgot your password?
								</Link>
								</div> */}
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								required
							/>
						</div>
						<Button
							type='submit'
							formAction={login}
							className='w-full'
						>
							Login
						</Button>

						{renderDivider()}

						<SocialNetworkLogin allowMagicLink />
					</div>
				</form>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/signup' className='underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
