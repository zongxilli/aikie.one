'use client';

import React from 'react';

const Temperature: React.FC = () => (
	<div className='max-w-xs'>
		<h3 className='font-semibold mb-2'>Temperature</h3>
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
				className='bg-blue-600 h-2.5 rounded-full'
				style={{ width: '50%' }}
			></div>
		</div>
		<ul className='text-sm'>
			<li>
				<strong>Low (0.1-0.3):</strong> More focused, consistent
			</li>
			<li>
				<strong>Medium (0.4-0.6):</strong> Balanced creativity
			</li>
			<li>
				<strong>High (0.7-1.0):</strong> More random, diverse
			</li>
		</ul>
	</div>
);

export default Temperature;
