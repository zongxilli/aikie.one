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
		<div className='h-14 w-full flex justify-center items-center shadow'>
			<div className='container  flex justify-between items-center'>
				{renderLogo()}
				{renderActionButtons()}
			</div>
		</div>
	);
};

export default Header;
