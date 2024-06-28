import { PropsWithChildren, ReactNode } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';

type Props = PropsWithChildren<{
	tooltip: ReactNode | string;
}>;

const TooltipWrapper = ({ tooltip, children }: Props) => {
	const renderTooltipContent = () => {
		if (typeof tooltip === 'string') {
			return <p>{tooltip}</p>;
		}

		return tooltip;
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{renderTooltipContent()}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipWrapper;
