export enum AIProvider {
	openAI = 'openAI',
	anthropic = 'anthropic',
}

export const getAIModel = (provider: AIProvider) =>
	provider === AIProvider.openAI ? 'GPT 4o' : '3.5 Sonnet';
