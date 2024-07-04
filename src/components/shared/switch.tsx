'use client';

import React, { useState } from 'react';

interface Option<T> {
	value: T;
	label: string;
}

interface SwitchProps<T> {
	option1: Option<T>;
	option2: Option<T>;
	onChange?: (selectedOption: T) => void;
}

const Switch = <T extends string | number>({
	option1,
	option2,
	onChange,
}: SwitchProps<T>) => {
	const [isOption1, setIsOption1] = useState(true);

	const toggleSwitch = () => {
		setIsOption1((prev) => !prev);
		onChange?.(isOption1 ? option2.value : option1.value);
	};

	return (
		<div
			className='flex items-center justify-center bg-secondary rounded-full p-0.5 cursor-pointer w-44 h-9 relative'
			onClick={toggleSwitch}
		>
			<div
				className={`absolute top-[3px] left-[3px] bg-primary rounded-full w-[calc(50%-3px)] h-[calc(100%-6px)] transition-all duration-300 ease-in-out ${
					isOption1 ? 'translate-x-0' : 'translate-x-full'
				}`}
			/>
			<span
				className={`z-10 w-1/2 text-center text-sm transition-colors duration-300 ${
					isOption1
						? 'text-primary-foreground'
						: 'text-secondary-foreground'
				}`}
			>
				{option1.label}
			</span>
			<span
				className={`z-10 w-1/2 text-center text-sm transition-colors duration-300 ${
					!isOption1
						? 'text-primary-foreground'
						: 'text-secondary-foreground'
				}`}
			>
				{option2.label}
			</span>
		</div>
	);
};

export default Switch;
