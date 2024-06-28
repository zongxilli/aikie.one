'use client';

import { useTheme } from 'next-themes';

const useThemeToggle = () => {
	const { setTheme, theme } = useTheme();

	return () => setTheme(theme === 'light' ? 'dark' : 'light');
};

export default useThemeToggle;
