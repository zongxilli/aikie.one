'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/providers/user';

const Danger = () => {
	const { toast } = useToast();
	const { user } = useUserStore((state) => state);

	const handleDeleteAccount = async () => {
		try {
			if (user?.id) {
				// await deleteUserAccount(user?.id);

				toast({
					variant: 'success',
					title: 'Delete successful',
					description: 'Your account has been deleted successfully',
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

	const renderConfirmationModal = () => {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant='destructive' disabled>
						Delete account
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently
							delete your account and remove your data from our
							servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteAccount}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	};

	return (
		<div className='flex-grow flex flex-col gap-4'>
			<Card>
				<CardHeader>
					<div className='text-xl font-semibold mb-1'>
						Delete your account
					</div>
					<CardDescription>
						Sorry, we do not support deleting your account right
						now.
					</CardDescription>
				</CardHeader>
				<CardContent>{renderConfirmationModal()}</CardContent>
			</Card>
		</div>
	);
};

export default Danger;
