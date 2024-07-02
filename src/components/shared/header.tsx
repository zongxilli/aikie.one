// import { usePathname } from 'next/navigation';

import ThemeToggle from './themeToggle';
import UserProfileButton from './userProfileButton';

// const getTitleText = (pathname: string) => {
// 	switch (pathname) {
// 		case '/home':
// 			return 'Dashboard';

// 		case '/account':
// 			return 'Account';

// 		case '/chat':
// 			return 'Chat with AI';

// 		default:
// 			return '';
// 	}
// };

const Header = () => {
	// const pathname = usePathname();

	const renderTitle = () => {
		return <div className='text-xl'></div>;
	};

	const renderThemeToggle = () => <ThemeToggle />;

	const renderUserIcon = () => <UserProfileButton />;

	const renderActionButtons = () => (
		<div className='flex items-center gap-4'>
			{renderThemeToggle()}
			{renderUserIcon()}
		</div>
	);

	return (
		<div className='h-full w-full flex justify-between items-center'>
			{renderTitle()}
			{renderActionButtons()}
		</div>
	);
};

export default Header;
