'use client';

import React, {
	useState,
	useRef,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react';

import { CircleHelp, ListPlus, Pen, Trash } from 'lucide-react';

import { LoadingOverlay, Switch, TooltipWrapper } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
	deleteChatSession,
	updateChatSessionName,
} from '@/db/queries-chat-sessions';
import { ChatSession } from '@/db/schema';
import { useUserStore } from '@/providers/user';
import { AIProvider, getAIModel } from '@/types/AI';

import { ModelConfig } from '../page';

import System from './tooltips/system';
import Temperature from './tooltips/temperature';

type Props = {
	selectedSessionId: string | null;
	setSelectedSessionId: Dispatch<SetStateAction<string | null>>;
	sessions: ChatSession[];
	isLoading: boolean;
	modelConfig: ModelConfig;
	setModelConfig: Dispatch<SetStateAction<ModelConfig>>;
};

const ChatSessions = ({
	selectedSessionId,
	setSelectedSessionId,
	sessions,
	isLoading,
	modelConfig,
	setModelConfig,
}: Props) => {
	const { toast } = useToast();
	const { user } = useUserStore((state) => state);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState('');
	// const [provider, setProvider] = useState<AIProvider>(AIProvider.openAI);
	// const [temperature, setTemperature] = useState(0.7);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editingId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingId]);

	const handleRename = (sessionId: string, currentName: string) => {
		setEditingId(sessionId);
		setEditingName(currentName);
	};

	const handleRenameSubmit = async (sessionId: string, userId: string) => {
		if (editingName.trim() !== '') {
			await updateChatSessionName(sessionId, userId, editingName.trim());
		}
		setEditingId(null);
	};

	const renderContent = () => {
		if (isLoading)
			return <LoadingOverlay label='Loading conversations...' />;

		const renderModelConfigs = () => {
			const handleTemperatureChange = (value: number[]) => {
				setModelConfig((config) => ({
					...config,
					temperature: value[0] / 100,
				}));
			};

			return (
				<fieldset className='flex-shrink-0 flex flex-col gap-6 px-1'>
					<div className='w-full flex flex-col gap-2'>
						<label
							htmlFor='temperature-slider'
							className='text-sm font-medium mb-2 flex items-center justify-between'
						>
							<div className='flex items-center gap-1'>
								Temperature:
								<TooltipWrapper
									tooltip={
										<Temperature
											temperature={
												modelConfig.temperature
											}
										/>
									}
									position='right'
								>
									<CircleHelp className='w-4 h-4 cursor-pointer' />
								</TooltipWrapper>
							</div>
							<div>{modelConfig.temperature.toFixed(2)}</div>
						</label>
						<Slider
							id='temperature-slider'
							min={0}
							max={100}
							step={5}
							value={[modelConfig.temperature * 100]}
							onValueChange={handleTemperatureChange}
							className='w-full cursor-pointer'
						/>
					</div>
					<div className='grid gap-3'>
						<div className='flex items-center gap-1'>
							<Label htmlFor='prompt'>Prompt</Label>
							<TooltipWrapper
								tooltip={<System />}
								position='right'
							>
								<CircleHelp className='w-4 h-4 cursor-pointer' />
							</TooltipWrapper>
						</div>
						<Textarea
							id='prompt'
							onChange={(e) => {
								setModelConfig((config) => ({
									...config,
									system: e.target.value,
								}));
							}}
						/>
					</div>
				</fieldset>
			);
		};

		const renderSessionActionButtons = (session: ChatSession) => {
			if (editingId === session.id) return null;

			return (
				<div className='items-center gap-3 hidden group-hover:flex group-[.selected]:flex'>
					<TooltipWrapper tooltip='rename'>
						<Pen
							className='action-button w-4 h-4'
							onClick={(e) => {
								e.stopPropagation();
								handleRename(session.id, session.name);
							}}
						/>
					</TooltipWrapper>
					<TooltipWrapper tooltip='delete'>
						<Trash
							className='action-button w-4 h-4'
							onClick={(e) => {
								e.stopPropagation();
								deleteChatSession(session.id, session.user_id);
							}}
						/>
					</TooltipWrapper>
				</div>
			);
		};

		const renderSessionLabel = (session: ChatSession) => {
			if (editingId === session.id)
				return (
					<Input
						ref={inputRef}
						value={editingName}
						onChange={(e) => setEditingName(e.target.value)}
						onBlur={() =>
							handleRenameSubmit(session.id, session.user_id)
						}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleRenameSubmit(session.id, session.user_id);
							}
						}}
						className='flex-grow h-full outline'
					/>
				);

			return (
				<p className='text-one-line flex-grow text-left'>
					{session.name}
				</p>
			);
		};

		const renderSessions = () => {
			return (
				<div className='flex flex-col flex-grow overflow-auto'>
					{sessions.map((session) => (
						<Button
							variant='ghost'
							className={`flex items-center justify-between gap-4 group ${
								session.id === selectedSessionId
									? 'selected'
									: ''
							}`}
							key={session.id}
							selected={session.id === selectedSessionId}
							onClick={() => setSelectedSessionId(session.id)}
						>
							{renderSessionLabel(session)}
							{renderSessionActionButtons(session)}
						</Button>
					))}
				</div>
			);
		};

		const renderTopBar = () => {
			return (
				<div className='flex-shrink-0 w-full flex items-center justify-between'>
					<Switch
						disabled
						value={modelConfig.provider}
						option1={{
							value: AIProvider.openAI,
							label: getAIModel(AIProvider.openAI),
						}}
						option2={{
							value: AIProvider.anthropic,
							label: getAIModel(AIProvider.anthropic),
						}}
						onChange={(option: AIProvider) => {
							setModelConfig((config) => ({
								...config,
								provider: option,
							}));
						}}
					/>

					<TooltipWrapper tooltip='Start a new chat'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setSelectedSessionId(null)}
						>
							<ListPlus className='h-5 w-5' />
						</Button>
					</TooltipWrapper>
				</div>
			);
		};

		return (
			<div className='w-full h-[calc(100dvh_-_8rem)] flex flex-col gap-4'>
				{renderTopBar()}
				{renderModelConfigs()}
				{renderSessions()}
			</div>
		);
	};

	return (
		<div className='w-full h-full p-4 box-border'>
			<div className='w-full h-full flex flex-col'>{renderContent()}</div>
		</div>
	);
};

export default ChatSessions;
