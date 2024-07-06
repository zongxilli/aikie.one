'use client';

import React, { useState, useEffect } from 'react';

interface Option<T> {
	value: T;
	label: string;
}

interface SwitchProps<T> {
	option1: Option<T>;
	option2: Option<T>;
	value?: T;
	onChange?: (selectedOption: T) => void;
	disabled?: boolean;
}

const Switch = <T extends string | number>({
	option1,
	option2,
	value,
	onChange,
	disabled = false,
}: SwitchProps<T>) => {
	const [isOption1, setIsOption1] = useState(() => {
		return value === undefined ? true : value === option1.value;
	});

	useEffect(() => {
		if (value !== undefined) {
			setIsOption1(value === option1.value);
		}
	}, [value, option1.value]);

	const toggleSwitch = () => {
		if (!disabled) {
			setIsOption1((prev) => !prev);
			onChange?.(!isOption1 ? option1.value : option2.value);
		}
	};

	return (
		<div
			className={`flex items-center justify-center bg-secondary rounded-full p-0.5 w-44 h-9 relative ${
				disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
			}`}
			onClick={toggleSwitch}
			role='switch'
			aria-checked={isOption1}
			aria-readonly={disabled}
			tabIndex={disabled ? -1 : 0}
		>
			<div
				className={`absolute top-[3px] left-[3px] rounded-full w-[calc(50%-3px)] h-[calc(100%-6px)] transition-all duration-300 ease-in-out ${
					isOption1 ? 'translate-x-0' : 'translate-x-full'
				} ${disabled ? 'bg-gray-400' : 'bg-primary'}`}
			/>
			<span
				className={`z-10 w-1/2 text-center text-sm transition-colors duration-300 ${
					isOption1
						? 'text-primary-foreground'
						: 'text-secondary-foreground'
				} ${disabled ? 'text-gray-500' : ''}`}
			>
				{option1.label}
			</span>
			<span
				className={`z-10 w-1/2 text-center text-sm transition-colors duration-300 ${
					!isOption1
						? 'text-primary-foreground'
						: 'text-secondary-foreground'
				} ${disabled ? 'text-gray-500' : ''}`}
			>
				{option2.label}
			</span>
		</div>
	);
};

export default Switch;
