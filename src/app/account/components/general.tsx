'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { updateUserImage } from '@/lib/userActionsClient';
import { useUserStore } from '@/providers/user';

import { UserProfile } from '../../types/users';

type UserField = Omit<UserProfile, 'id' | 'image'>;

const General = () => {
	const { toast } = useToast();
	const { user } = useUserStore((state) => state);

	const [userField, setUserField] = useState<UserField>({
		name: user?.name ?? '',
		email: user?.email ?? '',
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageFilePreviewUrl, setImageFilePreviewUrl] = useState<
		string | undefined
	>(undefined);

	useEffect(() => {
		setUserField({
			name: user?.name ?? '',
			email: user?.email ?? '',
		});
	}, [user]);

	useEffect(() => {
		if (imageFile) {
			const objectUrl = URL.createObjectURL(imageFile);
			setImageFilePreviewUrl(objectUrl);

			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [imageFile]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			setImageFile(file);
		}
	};

	const handleUpdateUserProfile = async () => {
		try {
			if (user?.id) {
				await updateUserProfile(
					user?.id,
					userField.name,
					userField.email
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

	const handleUpdateUserImage = async () => {
		try {
			if (user?.id && imageFile) {
				await updateUserImage(user.id, imageFile);

				toast({
					variant: 'success',
					title: 'Update successful',
					description: 'User image has been updated',
				});
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Upload failed',
				description: 'Please try again later',
			});
		}
	};

	const onGeneralFormChange = (field: keyof UserField, value: string) => {
		setUserField((prevForm) => {
			const newForm = { ...prevForm };
			newForm[field] = value;
			return newForm;
		});
	};

	return (
		<div className='flex-grow flex flex-col gap-4'>
			<Card>
				<CardHeader className='flex flex-row items-start justify-between'>
					<div className='flex flex-col items-start gap-2'>
						<CardTitle>Avatar</CardTitle>
						<CardDescription>
							Your avatar as displayed in the application.
						</CardDescription>
					</div>
					<Avatar className='h-12 w-12'>
						<AvatarImage src={imageFilePreviewUrl ?? user?.image} />
						<AvatarFallback>IMG</AvatarFallback>
					</Avatar>
				</CardHeader>
				<CardContent>
					<Input type='file' onChange={handleFileChange} />
				</CardContent>

				<CardFooter className='border-t px-6 py-4'>
					<Button
						disabled={imageFile === null}
						onClick={handleUpdateUserImage}
					>
						Save
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Name</CardTitle>
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
						You are not allowed to change your email address.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Input
						type='email'
						value={userField.email}
						onChange={(e) => {
							onGeneralFormChange('email', e.target.value);
						}}
						disabled
					/>
				</CardContent>

				<CardFooter className='border-t px-6 py-4'>
					<Button
						disabled={userField.name === user?.name}
						onClick={handleUpdateUserProfile}
					>
						Save
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default General;
