import Image from 'next/image';

import logo_outline from '@/../public/logo_outline.svg';

import SignInForm from './components/logInForm';

const LoginPage = () => {
	return (
		<div className='flex h-svh items-center'>
			<div className='fixed top-10 left-10 flex items-center gap-2 text-lg font-medium'>
				<Image
					src={logo_outline}
					alt='logo'
					width='20'
					height='20'
					className='w-10 h-10'
				/>
				Kenny
			</div>
			<SignInForm />
		</div>
	);
};

export default LoginPage;
