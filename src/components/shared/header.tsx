import Logo from './logo';
import ThemeToggle from './themeToggle';
import UserProfileButton from './userProfileButton';

const Header = () => {
	const renderLogo = () => <Logo />;

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
			{renderLogo()}
			{renderActionButtons()}
		</div>
	);
};

export default Header;
