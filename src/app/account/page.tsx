'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { updateUserProfile } from '@/lib/userActions';
import { useUserStore } from '@/providers/user';

import { UserProfile } from '../types/users';

type UserField = Omit<UserProfile, 'id'>;

export default function AccountPage() {
	const { toast } = useToast();

	const { user } = useUserStore((state) => state);

	const [tab, setTab] = useState(0);

	const [userField, setUserField] = useState<UserField>({
		name: user?.name ?? '',
		email: user?.email ?? '',
		image: user?.image ?? '',
	});

	const handleUpdateUserProfile = async () => {
		try {
			if (user?.id) {
				await updateUserProfile(
					user?.id,
					userField.name,
					userField.email,
					userField.image
				);

				toast({
					variant: 'success',
					title: 'Update successful',
					description: 'User profile has been updated',
				});
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Update failed',
				description: 'Please try again later',
			});
		}
	};

	useEffect(() => {
		setUserField({
			name: user?.name ?? '',
			email: user?.email ?? '',
			image: user?.image ?? '',
		});
	}, [user]);

	const onGeneralFormChange = (field: keyof UserField, value: string) => {
		setUserField((prevForm) => {
			const newForm = { ...prevForm };
			newForm[field] = value;
			return newForm;
		});
	};

	return (
		<main className='container h-full flex flex-col gap-4 p-4 md:gap-8 md:p-10'>
			<div className=''>
				<h1 className='text-3xl font-semibold'>Settings</h1>
				<h1 className='text-3xl font-semibold'>{user?.name}</h1>
			</div>
			<div className='w-full flex items-start justify-between gap-2 md:gap-6'>
				<div className='w-20 md:w-40 flex flex-col text-sm text-muted-foreground'>
					<Button
						className='flex justify-start'
						variant='ghost'
						onClick={() => setTab(0)}
					>
						General
					</Button>
					<Button
						className='flex justify-start'
						variant='ghost'
						onClick={() => setTab(1)}
					>
						Danger
					</Button>
				</div>
				<div className='flex-grow flex flex-col gap-4'>
					<Card>
						<CardHeader>
							<CardTitle>User Info</CardTitle>
							<CardDescription>
								Your user name used to identify you in this app.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Input
								type='text'
								value={userField.name}
								onChange={(e) => {
									onGeneralFormChange('name', e.target.value);
								}}
							/>
						</CardContent>
						<CardHeader>
							<CardTitle>Email</CardTitle>
							<CardDescription>
								You are not allowed to change your email address
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Input
								type='email'
								value={userField.email}
								onChange={(e) => {
									onGeneralFormChange(
										'email',
										e.target.value
									);
								}}
								disabled
							/>
						</CardContent>

						<CardFooter className='border-t px-6 py-4'>
							<Button onClick={handleUpdateUserProfile}>
								Save
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</main>
	);
}
