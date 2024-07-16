import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { NextRequest, NextResponse } from 'next/server';

import { createNewQuiz } from '@/db/queries-quizzes';
import { NewQuiz } from '@/db/schema';

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: NextRequest) {
	const body = await req.formData();
	const file = body.get('file');
	const questionCount = parseInt(body.get('questionCount') as string) || 10;
	console.log({ questionCount });
	const userId = body.get('userId') as string;

	if (!file || !(file instanceof Blob)) {
		return NextResponse.json(
			{ error: 'No file uploaded' },
			{ status: 400 }
		);
	}

	if (!userId) {
		return NextResponse.json(
			{ error: 'User ID is required' },
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

		const prompt = `
        Given the text which is a summary of the document, generate an engaging and comprehensive quiz based on the content. The quiz should follow this structure:

        1. Create a quiz object with fields: name, description, and questions.

        2. Generate exactly ${questionCount} questions. The questions should be a mix of multiple-choice (with 4 options) and single-choice questions. Each question should have:
           - The question text
           - Question type ('MultipleChoice' or 'SingleChoice')
           - Difficulty level ('Easy', 'Medium', or 'Hard')
           - An explanation of the correct answer
           - 4 possible answers for both multiple-choice and single-choice questions
           - At least one hint (maximum 3 hints)
           - A suggestedTime to answer the question (in seconds)

        3. Ensure that the questions cover a range of topics from the text and vary in difficulty.

        4. Make the quiz engaging by using a mix of straightforward and thought-provoking questions.

        5. Provide a suggestedTime for each question based on its difficulty and type:
           - Easy questions: 30-60 seconds
           - Medium questions: 60-90 seconds
           - Hard questions: 90-120 seconds
           - Multiple choice questions should have slightly less time than single choice of the same difficulty

        Return the result as a JSON object.
    `;

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
										type: {
											type: 'string',
											enum: [
												'MultipleChoice',
												'SingleChoice',
											],
										},
										difficulty: {
											type: 'string',
											enum: ['Easy', 'Medium', 'Hard'],
										},
										explanation: { type: 'string' },
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
											minItems: 4,
											maxItems: 4,
										},
										hints: {
											type: 'array',
											items: { type: 'string' },
											minItems: 1,
											maxItems: 3,
										},
										suggestedTime: { type: 'number' },
									},
									required: [
										'questionText',
										'type',
										'difficulty',
										'explanation',
										'answers',
										'hints',
										'suggestedTime',
									],
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

		const result = (await runnable.invoke([message])) as { quiz: NewQuiz };

		// 分配分数
		const questions = result.quiz.questions;

		// 在处理 AI 返回的结果时，计算总时间
		let totalTime = 0;
		questions.forEach((question) => {
			const suggestedTime =
				typeof question.suggestedTime === 'number'
					? question.suggestedTime
					: 60;
			totalTime += suggestedTime;
		});

		const difficultyCount = {
			Easy: questions.filter((q) => q.difficulty === 'Easy').length,
			Medium: questions.filter((q) => q.difficulty === 'Medium').length,
			Hard: questions.filter((q) => q.difficulty === 'Hard').length,
		};

		const baseScore = {
			Easy: 5,
			Medium: 8,
			Hard: 12,
		};

		// 计算初始总分
		let totalPoints =
			difficultyCount.Easy * baseScore.Easy +
			difficultyCount.Medium * baseScore.Medium +
			difficultyCount.Hard * baseScore.Hard;

		// 如果总分不等于100，调整分数
		const scaleFactor = 100 / totalPoints;

		questions.forEach((question) => {
			question.points = Math.round(
				baseScore[question.difficulty] * scaleFactor
			);
			// 为多选题额外加1分
			if (question.type === 'MultipleChoice') {
				question.points += 1;
			}
		});

		// 确保总分为100
		const finalTotalPoints = questions.reduce(
			(sum, q) => sum + q.points,
			0
		);
		if (finalTotalPoints !== 100) {
			const diff = 100 - finalTotalPoints;
			// 将差值添加到最后一个问题上
			questions[questions.length - 1].points += diff;
		}

		// 准备要插入数据库的 quiz 数据
		const newQuiz: Omit<NewQuiz, 'user_id'> = {
			name: result.quiz.name,
			description: result.quiz.description,
			questions: result.quiz.questions,
			total_points: 100, // 总分始终为100
			total_time: Math.max(1, Math.round(totalTime)), // 确保总时间至少为1秒
		};

		const insertedQuiz = await createNewQuiz(userId, newQuiz);

		// 返回生成的 quiz 和数据库 ID
		return NextResponse.json(
			{
				quiz: insertedQuiz,
			},
			{ status: 200 }
		);
	} catch (e: any) {
		// eslint-disable-next-line no-console
		console.error('Error generating or saving quiz:', e);
		// eslint-disable-next-line no-console
		console.error('Error stack:', e.stack);
		return NextResponse.json(
			{ error: e.message, stack: e.stack },
			{ status: 500 }
		);
	}
}
