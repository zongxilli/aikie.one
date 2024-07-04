'use client';

import React from 'react';

interface TemperatureProps {
	temperature: number;
}

const Temperature: React.FC<TemperatureProps> = ({ temperature }) => {
	// 将 temperature 转换为百分比宽度
	const widthPercentage = `${temperature * 100}%`;

	// 根据 temperature 值确定颜色
	const getColor = () => {
		if (temperature <= 0.3) return 'bg-blue-500';
		if (temperature <= 0.6) return 'bg-green-500';
		return 'bg-red-500';
	};

	// 确定哪个范围应该加粗显示
	const isLow = temperature <= 0.3;
	const isMedium = temperature > 0.3 && temperature <= 0.6;
	const isHigh = temperature > 0.6;

	return (
		<div className='max-w-xs'>
			<h3 className='font-semibold mb-2'>
				Temperature: {temperature.toFixed(2)}
			</h3>
			<p className='mb-2'>
				Controls randomness: Lowering results in more focused and
				deterministic outputs, while raising it increases creativity and
				variability.
			</p>
			<div className='flex justify-between text-sm mb-1'>
				<span>0.0</span>
				<span>0.5</span>
				<span>1.0</span>
			</div>
			<div className='w-full bg-gray-200 rounded-full h-2.5 mb-2'>
				<div
					className={`h-2.5 rounded-full ${getColor()}`}
					style={{ width: widthPercentage }}
				></div>
			</div>
			<ul className='text-sm'>
				<li className={isLow ? 'font-bold' : ''}>
					<strong>Low (0.1-0.3):</strong> More focused, consistent
				</li>
				<li className={isMedium ? 'font-bold' : ''}>
					<strong>Medium (0.4-0.6):</strong> Balanced creativity
				</li>
				<li className={isHigh ? 'font-bold' : ''}>
					<strong>High (0.7-1.0):</strong> More random, diverse
				</li>
			</ul>
		</div>
	);
};

export default Temperature;
