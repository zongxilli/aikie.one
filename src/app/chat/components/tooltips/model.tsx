import { Cpu, Zap, Target, ExternalLink } from 'lucide-react';

const AIModelsTooltip = () => {
	const models = [
		{
			name: 'GPT-4 Optimized',
			description:
				"OpenAI's most advanced model, fine-tuned for optimal performance.",
			features: [
				'Enhanced reasoning and problem-solving',
				'Improved context understanding',
				'Optimized for efficiency and speed',
			],
			useCases: [
				'Complex analytical tasks',
				'Creative writing and ideation',
				'Advanced coding assistance',
			],
			link: 'https://openai.com/gpt-4',
		},
		{
			name: 'Claude 3.5 Sonnet',
			description:
				"Anthropic's advanced AI model, focusing on thoughtful and nuanced responses.",
			features: [
				'Strong language understanding',
				'Ethical reasoning capabilities',
				'Detailed and contextual outputs',
			],
			useCases: [
				'In-depth research assistance',
				'Ethical decision-making support',
				'Comprehensive document analysis',
			],
			link: 'https://www.anthropic.com',
		},
	];

	return (
		<div className='w-96 max-w-[95vw] p-4 bg-white dark:bg-gray-800 space-y-6'>
			<h2 className='text-lg font-bold text-center mb-4'>
				AI Model Comparison
			</h2>
			{models.map((model, index) => (
				<div
					key={index}
					className='space-y-3 pb-4 border-b last:border-b-0 dark:border-gray-700'
				>
					<div className='flex items-center space-x-2'>
						<Cpu className='h-5 w-5 text-blue-500' />
						<h3 className='font-semibold text-lg'>{model.name}</h3>
					</div>
					<p className='text-sm text-gray-600 dark:text-gray-300'>
						{model.description}
					</p>
					<div>
						<h4 className='text-sm font-semibold flex items-center mb-1'>
							<Zap className='h-4 w-4 mr-1 text-yellow-500' /> Key
							Features
						</h4>
						<ul className='text-xs space-y-1 text-gray-600 dark:text-gray-300'>
							{model.features.map((feature, idx) => (
								<li key={idx} className='flex items-start'>
									<span className='mr-1'>•</span> {feature}
								</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className='text-sm font-semibold flex items-center mb-1'>
							<Target className='h-4 w-4 mr-1 text-green-500' />{' '}
							Use Cases
						</h4>
						<ul className='text-xs space-y-1 text-gray-600 dark:text-gray-300'>
							{model.useCases.map((useCase, idx) => (
								<li key={idx} className='flex items-start'>
									<span className='mr-1'>•</span> {useCase}
								</li>
							))}
						</ul>
					</div>
					<a
						href={model.link}
						target='_blank'
						rel='noopener noreferrer'
						className='text-xs text-blue-500 hover:underline flex items-center'
					>
						Learn more <ExternalLink className='h-3 w-3 ml-1' />
					</a>
				</div>
			))}
		</div>
	);
};

export default AIModelsTooltip;
