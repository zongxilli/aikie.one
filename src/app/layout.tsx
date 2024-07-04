import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Baloo_Thambi_2 } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserStoreProvider } from '@/providers/user';

import { createClient } from '../../supabase/server';

import { ThemeProvider } from './themeProvider';

const font = Baloo_Thambi_2({ weight: ['500'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'AIkie',
	description: 'AI can help you with anything -by kennie',
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
					<TooltipProvider delayDuration={200}>
						<ThemeProvider
							attribute='class'
							defaultTheme='system'
							enableSystem
							disableTransitionOnChange
						>
							<SpeedInsights />
							<Analytics />
							<Toaster />
							{children}
						</ThemeProvider>
					</TooltipProvider>
				</UserStoreProvider>
			</body>
		</html>
	);
}
