import { useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
			className='px-1 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors flex items-center'
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
		let listItems: React.ReactNode[] = [];

		const renderCodeBlock = () => {
			const highlightedCode = (
				<div className='relative'>
					{codeLanguage && (
						<div className='absolute w-full h-8 top-[-2rem] left-0 bg-gray-700 text-gray-200 text-xs rounded-tl-lg rounded-tr-lg px-3 flex items-center justify-between'>
							<div>{codeLanguage.replace(/^`+/, '')}</div>
							<CopyButton text={codeContent.trim()} />
						</div>
					)}
					<SyntaxHighlighter
						language={codeLanguage.replace(/^`+/, '') || 'text'}
						style={nightOwl}
						className='rounded-bl-lg rounded-br-lg'
					>
						{codeContent.trim()}
					</SyntaxHighlighter>
				</div>
			);
			codeContent = '';
			codeLanguage = '';
			return highlightedCode;
		};

		return content.split('\n').map((line, index) => {
			// 处理代码块
			if (line.trim().startsWith('```')) {
				if (inCodeBlock) {
					inCodeBlock = false;
					const codeBlock = renderCodeBlock();
					if (inList) {
						listItems.push(
							<li key={`code-${index}`} className='pt-6'>
								{codeBlock}
							</li>
						);
						return null;
					}
					return (
						<div key={`code-${index}`} className='pt-4'>
							{codeBlock}
						</div>
					);
				} else {
					inCodeBlock = true;
					codeLanguage = line.slice(3).trim(); // 移除开头的 ```
					return null;
				}
			}

			if (inCodeBlock) {
				codeContent += line + '\n';
				return null;
			}

			// 处理列表项
			if (line.trim().startsWith('-')) {
				if (!inList) {
					inList = true;
					listItems = [];
				}
				listItems.push(
					<li
						key={`list-${index}`}
						dangerouslySetInnerHTML={{
							__html: formatLine(line.replace('-', '').trim()),
						}}
					/>
				);
				return null;
			}

			// 如果不是列表项且之前在列表中，渲染列表
			if (inList && !line.trim().startsWith('-')) {
				inList = false;
				const list = (
					<ul key={`ul-${index}`} className='list-disc pl-6 mb-4'>
						{listItems}
					</ul>
				);
				listItems = [];
				if (line.trim() === '') {
					return list;
				} else {
					return [
						list,
						<p
							key={`p-${index}`}
							className='mb-3'
							dangerouslySetInnerHTML={{
								__html: formatLine(line),
							}}
						/>,
					];
				}
			}

			// 处理其他情况（标题、段落等）
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
			if (line.trim() === '') {
				return <br key={index} />;
			}
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
