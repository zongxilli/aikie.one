import React from 'react';

const System: React.FC = () => (
	<div className='max-w-xs'>
		<h3 className='font-semibold mb-2'>System Prompt</h3>
		<p className='mb-2'>
			Sets the AI&apos;s behavior and knowledge context. It&apos;s like
			giving the AI a role or persona for the conversation.
		</p>
		<div className='bg-foreground/10 p-2 rounded-md text-sm mb-2'>
			<strong>Example:</strong> &quot;You are a helpful assistant with
			expertise in programming and software development.&quot;
		</div>
		<p className='text-sm'>
			A well-crafted system prompt can significantly improve the relevance
			and quality of the AI&apos;s responses for your specific use case.
		</p>
	</div>
);

export default System;
