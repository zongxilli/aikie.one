import type { Metadata } from 'next';
import { Baloo_Thambi_2 } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { UserStoreProvider } from '@/providers/user';

import { createClient } from '../../utils/supabase/server';

import { ThemeProvider } from './themeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

const font = Baloo_Thambi_2({ weight: ['500'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// load user from server supabase client
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<html lang='en' suppressHydrationWarning>
			<body className={font.className} suppressHydrationWarning>
				<UserStoreProvider userId={user?.id}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<TooltipProvider>
							<Toaster />
							{children}
						</TooltipProvider>
					</ThemeProvider>
				</UserStoreProvider>
			</body>
		</html>
	);
}
