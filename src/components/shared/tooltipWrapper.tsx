import { PropsWithChildren, ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Props = PropsWithChildren<{
	tooltip: ReactNode | string;
	position?: 'right' | 'top' | 'bottom' | 'left';
	positionOffset?: number;
}>;

const TooltipWrapper = ({
	tooltip,
	position,
	positionOffset = 5,
	children,
}: Props) => {
	const renderTooltipContent = () => {
		if (typeof tooltip === 'string') {
			return <p>{tooltip}</p>;
		}

		return tooltip;
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent
				className='z-50 dark:bg-gray-700'
				side={position}
				sideOffset={positionOffset}
			>
				{renderTooltipContent()}
			</TooltipContent>
		</Tooltip>
	);
};

export default TooltipWrapper;
