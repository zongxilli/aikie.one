import React, { ReactNode } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	footer: ReactNode;
	children: ReactNode;
	className?: string;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	description,
	footer,
	children,
	className = '',
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={`${className}`}>
				<DialogHeader>
					{title && <DialogTitle>{title}</DialogTitle>}
				</DialogHeader>
				<DialogDescription>{description}</DialogDescription>
				<div className='my-4'>{children}</div>
				<DialogFooter>{footer}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
