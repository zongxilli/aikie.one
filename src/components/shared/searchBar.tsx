'use client';

import { Dispatch, SetStateAction } from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchBarProps = {
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
	placeholder?: string;

	disabled?: boolean;
	className?: string;
};

const SearchBar = ({
	value,
	setValue,
	placeholder = 'Search...',

	disabled,
	className,
}: SearchBarProps) => {
	return (
		<div className={cn('h-10 w-80 relative', className)}>
			<Search className='h-4 w-4 absolute top-0 bottom-0 left-4 m-auto' />
			<Input
				disabled={disabled}
				className='w-full h-full pl-10 rounded-full'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default SearchBar;
