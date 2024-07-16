import { ReactNode } from 'react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type Item = {
	title: string | ReactNode;
	content: string | ReactNode;
	key: string;
};

type Props = {
	items: Item[];
	className?: string;
};

const CollapsiblePanels = ({ items, className }: Props) => {
	return (
		<Accordion
			type='single'
			collapsible
			className={cn('w-full', className)}
		>
			{items.map((item) => (
				<AccordionItem key={item.key} value={item.key}>
					<AccordionTrigger>{item.title}</AccordionTrigger>
					<AccordionContent>{item.content}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default CollapsiblePanels;
