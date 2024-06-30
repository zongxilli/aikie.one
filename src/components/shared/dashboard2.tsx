import { PropsWithChildren } from 'react';

import {
	LifeBuoy,
	LucideIcon,
	SquareTerminal,
	SquareUser,
	Triangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import Header from './header';
import TooltipWrapper from './tooltipWrapper';

const navButtonsMetadata = [
	{
		tooltip: 'Playground',
		Icon: SquareTerminal,
	},
] as const;

type Props = PropsWithChildren<{}>;

const Dashboard2 = ({ children }: Props) => {
	const renderNavButton = (tooltip: string, Icon: LucideIcon) => {
		return (
			<TooltipWrapper
				tooltip={tooltip}
				key={tooltip}
				position='right'
				positionOffset={5}
			>
				<Button
					variant='ghost'
					size='icon'
					className='rounded-lg bg-muted'
					aria-label={tooltip}
				>
					<Icon className='size-5' />
				</Button>
			</TooltipWrapper>
		);
	};

	const renderNavButtons = () =>
		navButtonsMetadata.map((data) =>
			renderNavButton(data.tooltip, data.Icon)
		);

	return (
		<div className='grid h-screen w-full pl-[56px]'>
			<aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
				<div className='border-b p-2'>
					<Button variant='outline' size='icon' aria-label='Home'>
						<Triangle className='size-5 fill-foreground' />
					</Button>
				</div>
				<nav className='grid gap-1 p-2'>{renderNavButtons()}</nav>
				<nav className='mt-auto grid gap-1 p-2'>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='mt-auto rounded-lg'
								aria-label='Help'
							>
								<LifeBuoy className='size-5' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							Help
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='mt-auto rounded-lg'
								aria-label='Account'
							>
								<SquareUser className='size-5' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							Account
						</TooltipContent>
					</Tooltip>
				</nav>
			</aside>
			<div className='flex flex-col'>
				<header className='sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4'>
					<Header />
				</header>
				<main className='grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
					{children}
				</main>
			</div>
		</div>
	);
};

export default Dashboard2;
