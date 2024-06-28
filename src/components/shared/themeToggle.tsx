'use client';

import { ReactNode, useEffect, useState } from 'react';

import { MoonStar, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useOnMountEffect } from '@/hooks';

import { Button } from '../ui/button';

import TooltipWrapper from './tooltipWrapper';

const ThemeToggle = () => {
	const { setTheme, theme } = useTheme();

	const [icon, setIcon] = useState<ReactNode | null>(null);

	useOnMountEffect(() => {
		setIcon(
			theme === 'light' ? (
				<Sparkles className='w-4 h-4' />
			) : (
				<MoonStar className='w-4 h-4' />
			)
		);
	});

	useEffect(() => {
		setIcon(
			theme === 'light' ? (
				<Sparkles className='w-4 h-4' />
			) : (
				<MoonStar className='w-4 h-4' />
			)
		);
	}, [theme]);

	const handleThemeToggle = () =>
		setTheme(theme === 'light' ? 'dark' : 'light');

	return (
		<TooltipWrapper tooltip='Change theme'>
			<Button
				size='icon'
				variant='googleAction'
				onClick={handleThemeToggle}
			>
				{icon}
			</Button>
		</TooltipWrapper>
	);
};

export default ThemeToggle;
