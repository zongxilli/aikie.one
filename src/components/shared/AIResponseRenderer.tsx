import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	};

	return (
		<button
			onClick={handleCopy}
			className='absolute top-2 right-2 px-1 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors flex items-center'
		>
			{copied ? <Check size={14} /> : <Copy size={14} />}
			<span className='ml-1 text-xs'>
				{copied ? 'Copied!' : 'Copy code'}
			</span>
		</button>
	);
};

interface GPT4oResponseRendererProps {
	content: string;
}

const AIResponseRenderer: React.FC<GPT4oResponseRendererProps> = ({
	content,
}) => {
	const formatLine = (line: string) => {
		// Handle inline code
		line = line.replace(
			/`([^`]+)`/g,
			'<code class="bg-foreground/30 text-white px-1 py-0.5 rounded font-mono text-sm">$1</code>'
		);

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
		let inCodeBlock = false;
		let codeContent = '';
		let codeLanguage = '';

		return content.split('\n').map((line, index) => {
			// Handle code blocks
			if (line.startsWith('```')) {
				if (inCodeBlock) {
					inCodeBlock = false;
					const highlightedCode = (
						<div key={index} className='relative'>
							<SyntaxHighlighter
								language={codeLanguage}
								style={tomorrow}
								className='rounded-md mt-4'
							>
								{codeContent.trim()}
							</SyntaxHighlighter>
							<CopyButton text={codeContent.trim()} />
						</div>
					);
					codeContent = '';
					codeLanguage = '';
					return highlightedCode;
				} else {
					inCodeBlock = true;
					codeLanguage = line.slice(3).trim();
					return null;
				}
			}

			if (inCodeBlock) {
				codeContent += line + '\n';
				return null;
			}

			if (line.startsWith('###')) {
				return (
					<h3 key={index} className='text-xl font-bold mt-6 mb-3'>
						<span
							dangerouslySetInnerHTML={{
								__html: formatLine(
									line.replace('###', '').trim()
								),
							}}
						/>
					</h3>
				);
			}
			if (line.startsWith('**') && line.endsWith('**')) {
				return (
					<h4 key={index} className='text-lg font-semibold mt-4 mb-2'>
						<span
							dangerouslySetInnerHTML={{
								__html: formatLine(
									line.replace(/^\*\*|\*\*$/g, '')
								),
							}}
						/>
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

export default AIResponseRenderer;
