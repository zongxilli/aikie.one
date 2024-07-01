'use client';

import { useState } from 'react';

import { z } from 'zod';

import { SocialNetworkLogin } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { signup } from '@/db/supabase-actions/auth-server';
import { cn } from '@/lib/utils';

const signupSchema = z
	.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	// State for form data and errors
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<z.ZodIssue[]>([]);

	// Handle input changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			signupSchema.parse(formData);
			const formDataToSend = new FormData();
			formDataToSend.append('first-name', formData.firstName);
			formDataToSend.append('last-name', formData.lastName);
			formDataToSend.append('email', formData.email);
			formDataToSend.append('password', formData.password);

			signup(formDataToSend);

			toast({
				variant: 'success',
				title: 'Email Confirmation Required',
				description:
					'A confirmation link has been sent to your email. Please check your inbox and click the link to complete your registration.',
				duration: 10000,
			});

			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				password: '',
				confirmPassword: '',
			});
			setErrors([]);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setErrors(error.issues);
			}
		}
	};

	const renderUserInfoForm = () => {
		const renderNameInputs = () => (
			<div className='flex items-start justify-between gap-4'>
				<div className='grid gap-2'>
					<Label htmlFor='firstName'>First name</Label>
					<Input
						name='firstName'
						id='firstName'
						placeholder='John'
						value={formData.firstName}
						onChange={handleChange}
					/>
					{errors.find((e) => e.path[0] === 'firstName') && (
						<p className='text-red-500 text-sm'>
							{
								errors.find((e) => e.path[0] === 'firstName')!
									.message
							}
						</p>
					)}
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='lastName'>Last name</Label>
					<Input
						name='lastName'
						id='lastName'
						placeholder='Doe'
						value={formData.lastName}
						onChange={handleChange}
					/>
					{errors.find((e) => e.path[0] === 'lastName') && (
						<p className='text-red-500 text-sm'>
							{
								errors.find((e) => e.path[0] === 'lastName')!
									.message
							}
						</p>
					)}
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
						value={formData.email}
						onChange={handleChange}
					/>
					{errors.find((e) => e.path[0] === 'email') && (
						<p className='text-red-500 text-sm'>
							{errors.find((e) => e.path[0] === 'email')!.message}
						</p>
					)}
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='password'>Password</Label>
					<Input
						name='password'
						id='password'
						type='password'
						value={formData.password}
						onChange={handleChange}
					/>
					{errors.find((e) => e.path[0] === 'password') && (
						<p className='text-red-500 text-sm'>
							{
								errors.find((e) => e.path[0] === 'password')!
									.message
							}
						</p>
					)}
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='confirmPassword'>Confirm Password</Label>
					<Input
						name='confirmPassword'
						id='confirmPassword'
						type='password'
						value={formData.confirmPassword}
						onChange={handleChange}
					/>
					{errors.find((e) => e.path[0] === 'confirmPassword') && (
						<p className='text-red-500 text-sm'>
							{
								errors.find(
									(e) => e.path[0] === 'confirmPassword'
								)!.message
							}
						</p>
					)}
				</div>
			</>
		);

		const renderCreateAccountButton = () => (
			<Button type='submit' className='w-full'>
				Create an account
			</Button>
		);

		return (
			<form onSubmit={handleSubmit}>
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
