'use client';

import { useState } from 'react';

import { Link2, LucideIcon } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	signInWithGoogle,
	signInWithGitHub,
	signInWithMagicLink,
} from '@/db/supabase-actions/auth-server';

import { useToast } from '../ui/use-toast';

const socialNetworksMetadata = [
	{
		Icon: FcGoogle,
		handler: signInWithGoogle,
		providerName: 'Google',
	},
	{
		Icon: FaGithub,
		handler: signInWithGitHub,
		providerName: 'Github',
	},
] as const;

type Props = {
	allowMagicLink?: boolean;
};

const SocialNetworkLogin = ({ allowMagicLink = false }: Props) => {
	const { toast } = useToast();

	const [magicLinkEmail, setMagicLinkEmail] = useState('');
	const [showSendMagicLinkModal, setShowMagicLinkModal] = useState(false);

	const renderMagicLinkButtonAndModal = () => {
		if (!allowMagicLink) return null;

		const handleSendMagicLink = () => {
			signInWithMagicLink(magicLinkEmail);
			toast({
				variant: 'success',
				title: 'Magic Link Sent',
				description:
					'A secure login link has been sent to your email address. Please check your inbox and spam folder.',
			});
			setShowMagicLinkModal(false);
			setMagicLinkEmail('');
		};

		return (
			<Dialog
				open={showSendMagicLinkModal}
				onOpenChange={setShowMagicLinkModal}
			>
				<DialogTrigger asChild>
					<Button variant='outline' className='w-full'>
						<Link2 className='w-5 h-5 mr-2' />
						Sign in using one-time link
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Sign in with magic link</DialogTitle>
						<DialogDescription>
							Enter your email address to receive a secure,
							one-time login link.
						</DialogDescription>
					</DialogHeader>
					<Label htmlFor='email'>Email Address</Label>
					<Input
						id='email'
						type='email'
						value={magicLinkEmail}
						onChange={(e) => setMagicLinkEmail(e.target.value)}
					/>

					<DialogFooter>
						<Button type='submit' onClick={handleSendMagicLink}>
							Send
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	const renderSocialNetworkSignInButton = (
		Icon: IconType | LucideIcon,
		handler: () => Promise<void>,
		providerName: string,
		key: number
	) => {
		return (
			<Button
				type='button'
				key={key}
				variant='outline'
				className='w-full'
				onClick={() => {
					handler();
				}}
			>
				<Icon className='w-5 h-5 mr-2' />
				Continue with {providerName}
			</Button>
		);
	};

	return (
		<div className='flex flex-col items-center gap-2'>
			{socialNetworksMetadata.map((data, idx) =>
				renderSocialNetworkSignInButton(
					data.Icon,
					data.handler,
					data.providerName,
					idx
				)
			)}

			{renderMagicLinkButtonAndModal()}
			{/* <Button
				onClick={() => {
					toast({
						variant: 'success',
						title: 'Magic Link Sent',
						description:
							'A secure login link has been sent to your email address. Please check your inbox and spam folder.',
					});
				}}
			>
				test
			</Button> */}
		</div>
	);
};

export default SocialNetworkLogin;
