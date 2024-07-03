import { Loader2 } from 'lucide-react';

type Props = {
	label?: string;
};

const LoadingOverlay = ({ label = '' }: Props) => {
	return (
		<div className='w-full h-full flex flex-col items-center justify-center gap-4 text-foreground/50'>
			<Loader2 className='animate-spin h-8 w-8' />
			<div className=''>{label}</div>
		</div>
	);
};

export default LoadingOverlay;
