import React, { ReactNode } from 'react';

import { CircleHelp } from 'lucide-react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import TooltipWrapper from './tooltipWrapper';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	footer: ReactNode;
	titleTooltip?: ReactNode;
	children: ReactNode;
	className?: string;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	description,
	footer,
	titleTooltip,
	children,
	className = '',
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={`${className}`}>
				<DialogHeader>
					<DialogTitle>
						<div className='flex items-center'>
							{title}
							{titleTooltip && (
								<TooltipWrapper tooltip={titleTooltip}>
									<CircleHelp className='w-4 h-4 ml-2 cursor-pointer' />
								</TooltipWrapper>
							)}
						</div>
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>{description}</DialogDescription>
				<div className='my-4'>{children}</div>
				<DialogFooter>{footer}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
