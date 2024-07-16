'use client';

import { PropsWithChildren } from 'react';

import { Loader2 } from 'lucide-react';

type Props = PropsWithChildren<{
	isLoading?: boolean;
}>;

const LoadingWrapper = ({ isLoading, children }: Props) => {
	if (isLoading) return <Loader2 className='animate-spin h-4 w-4' />;

	return <>{children}</>;
};

export default LoadingWrapper;
