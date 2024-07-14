import clsx from 'clsx';

import { cn } from '@/lib/utils';

export enum CircleProgressBarSize {
	small = 28,
	medium = '8rem',
	large = 40,
}

interface Props {
	max: number;
	value: number;
	min: number;
	size?: CircleProgressBarSize;
	label?: string;
	gaugePrimaryColor: string;
	gaugeSecondaryColor: string;
	className?: string;
}

export default function AnimatedCircularProgressBar({
	max = 100,
	min = 0,
	value = 0,
	size = CircleProgressBarSize.medium,
	label,
	gaugePrimaryColor,
	gaugeSecondaryColor,
	className,
}: Props) {
	const circumference = 2 * Math.PI * 45;
	const percentPx = circumference / 100;
	const currentPercent = ((value - min) / (max - min)) * 100;

	return (
		<div
			className={clsx(
				cn('relative size-32 text-2xl font-semibold', className),
				{
					'size-28': size === CircleProgressBarSize.small,
					'size-32': size === CircleProgressBarSize.medium,
					'size-40': size === CircleProgressBarSize.large,
				}
			)}
			style={
				{
					'--circle-size': '100px',
					'--circumference': circumference,
					'--percent-to-px': `${percentPx}px`,
					'--gap-percent': '5',
					'--offset-factor': '0',
					'--transition-length': '0.5s',
					'--transition-step': '100ms',
					'--delay': '0.2s',
					'--percent-to-deg': '3.6deg',
					transform: 'translateZ(0)',
				} as React.CSSProperties
			}
		>
			<svg
				fill='none'
				className='size-full'
				strokeWidth='2'
				viewBox='0 0 100 100'
			>
				{currentPercent <= 90 && currentPercent >= 0 && (
					<circle
						cx='50'
						cy='50'
						r='45'
						strokeWidth='10'
						strokeDashoffset='0'
						strokeLinecap='round'
						strokeLinejoin='round'
						className=' opacity-100'
						style={
							{
								stroke: gaugeSecondaryColor,
								'--stroke-percent': 90 - currentPercent,
								'--offset-factor-secondary':
									'calc(1 - var(--offset-factor))',
								strokeDasharray:
									'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
								transform:
									'rotate(calc(1turn - 90deg - (var(--gap-percent) * var(--percent-to-deg) * var(--offset-factor-secondary)))) scaleY(-1)',
								transition:
									'all var(--transition-length) ease var(--delay)',
								transformOrigin:
									'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
							} as React.CSSProperties
						}
					/>
				)}
				<circle
					cx='50'
					cy='50'
					r='45'
					strokeWidth='10'
					strokeDashoffset='0'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='opacity-100'
					style={
						{
							stroke: gaugePrimaryColor,
							'--stroke-percent': currentPercent,
							strokeDasharray:
								'calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)',
							transition:
								'var(--transition-length) ease var(--delay),stroke var(--transition-length) ease var(--delay)',
							transitionProperty: 'stroke-dasharray,transform',
							transform:
								'rotate(calc(-90deg + var(--gap-percent) * var(--offset-factor) * var(--percent-to-deg)))',
							transformOrigin:
								'calc(var(--circle-size) / 2) calc(var(--circle-size) / 2)',
						} as React.CSSProperties
					}
				/>
			</svg>
			<span
				data-current-value={value}
				className='duration-[var(--transition-length)] delay-[var(--delay)] absolute inset-0 m-auto size-fit ease-linear animate-in fade-in flex flex-col items-center'
			>
				<p className='text-md'>{value}</p>
				{label && <p className='text-sm'>{label}</p>}
			</span>
		</div>
	);
}
