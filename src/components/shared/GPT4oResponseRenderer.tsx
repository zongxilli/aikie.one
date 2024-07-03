import React from 'react';

interface GPT4oResponseRendererProps {
	content: string;
}

const GPT4oResponseRenderer: React.FC<GPT4oResponseRendererProps> = ({
	content,
}) => {
	const formatLine = (line: string) => {
		// Handle bold text
		line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Handle links
		line = line.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>'
		);

		return line;
	};

	const renderContent = () => {
		let inList = false;
		return content.split('\n').map((line, index) => {
			if (line.startsWith('###')) {
				return (
					<h3 key={index} className='text-xl font-bold mt-6 mb-3'>
						{formatLine(line.replace('###', '').trim())}
					</h3>
				);
			}
			if (line.startsWith('**') && line.endsWith('**')) {
				return (
					<h4 key={index} className='text-lg font-semibold mt-4 mb-2'>
						{formatLine(line.replace(/^\*\*|\*\*$/g, ''))}
					</h4>
				);
			}
			if (line.startsWith('-')) {
				if (!inList) {
					inList = true;
					return (
						<ul key={index} className='list-disc pl-6 mb-4'>
							<li
								dangerouslySetInnerHTML={{
									__html: formatLine(
										line.replace('-', '').trim()
									),
								}}
							/>
						</ul>
					);
				}
				return (
					<li
						key={index}
						dangerouslySetInnerHTML={{
							__html: formatLine(line.replace('-', '').trim()),
						}}
					/>
				);
			}
			if (line.trim() === '') {
				inList = false;
				return <br key={index} />;
			}
			inList = false;
			return (
				<p
					key={index}
					className='mb-3'
					dangerouslySetInnerHTML={{ __html: formatLine(line) }}
				/>
			);
		});
	};

	return <div className='gpt-response p-6 rounded-lg'>{renderContent()}</div>;
};

export default GPT4oResponseRenderer;
