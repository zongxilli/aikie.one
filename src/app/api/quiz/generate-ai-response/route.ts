import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: NextRequest) {
	const body = await req.formData();
	const file = body.get('file');

	if (!file || !(file instanceof Blob)) {
		return NextResponse.json(
			{ error: 'No file uploaded' },
			{ status: 400 }
		);
	}

	try {
		let content: string;

		if (file.type === 'application/pdf') {
			const pdfLoader = new PDFLoader(file as Blob, {
				parsedItemSeparator: ' ',
			});
			const docs = await pdfLoader.load();
			content = docs.map((doc) => doc.pageContent).join('\n');
		} else if (file.type === 'text/plain') {
			content = await file.text();
		} else {
			return NextResponse.json(
				{ error: 'Unsupported file type' },
				{ status: 400 }
			);
		}

		const prompt =
			'Given the text which is a summary of the document, generate a quiz based on the text. Return JSON only that contains a quiz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.';

		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{ error: 'OpenAI API key not provided' },
				{ status: 500 }
			);
		}

		const model = new ChatOpenAI({
			openAIApiKey: process.env.OPENAI_API_KEY,
			modelName: 'gpt-4o',
		});

		const parser = new JsonOutputFunctionsParser();
		const extractionFunctionSchema = {
			name: 'extractor',
			description: 'Extracts fields from the output',
			parameters: {
				type: 'object',
				properties: {
					quiz: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							description: { type: 'string' },
							questions: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										questionText: { type: 'string' },
										answers: {
											type: 'array',
											items: {
												type: 'object',
												properties: {
													answerText: {
														type: 'string',
													},
													isCorrect: {
														type: 'boolean',
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		};

		const runnable = model
			.bind({
				functions: [extractionFunctionSchema],
				function_call: { name: 'extractor' },
			})
			.pipe(parser);

		const message = new HumanMessage({
			content: [
				{
					type: 'text',
					text: prompt + '\n' + content,
				},
			],
		});

		const result: any = await runnable.invoke([message]);
		console.log('Generated quiz:', result);

		return NextResponse.json(result, { status: 200 });
	} catch (e: any) {
		console.error('Error generating quiz:', e);
		console.error('Error stack:', e.stack);
		return NextResponse.json(
			{ error: e.message, stack: e.stack },
			{ status: 500 }
		);
	}
}
