'use client';

import { SocialNetworkLogin } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signup } from '@/lib/authActions';
import { cn } from '@/lib/utils';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const renderUserInfoForm = () => {
		const renderNameInputs = () => (
			<div className='grid grid-cols-2 gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='first-name'>First name</Label>
					<Input
						name='first-name'
						id='first-name'
						placeholder='Max'
						required
					/>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='last-name'>Last name</Label>
					<Input
						name='last-name'
						id='last-name'
						placeholder='Robinson'
						required
					/>
				</div>
			</div>
		);

		const renderPasswordAndEmailForm = () => (
			<>
				<div className='grid gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						name='email'
						id='email'
						type='email'
						placeholder='mail@example.com'
						required
					/>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='password'>Password</Label>
					<Input name='password' id='password' type='password' />
				</div>
			</>
		);

		const renderCreateAccountButton = () => (
			<Button formAction={signup} type='submit' className='w-full'>
				Create an account
			</Button>
		);

		return (
			<form action=''>
				<div className='grid gap-4'>
					{renderNameInputs()}
					{renderPasswordAndEmailForm()}
					{renderCreateAccountButton()}
				</div>
			</form>
		);
	};

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

	const renderSocialNetworkLogin = () => <SocialNetworkLogin />;

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			{renderUserInfoForm()}
			{renderDivider()}
			{renderSocialNetworkLogin()}
		</div>
	);
}
