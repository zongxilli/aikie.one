import { Pen, Trash } from 'lucide-react';

import { LoadingOverlay, TooltipWrapper } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { deleteChatSession } from '@/db/queries-chat';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';

type Props = {
	selectedSessionsId: string;
};

const ChatSessions = ({ selectedSessionsId }: Props) => {
	const { sessions, isLoading } = useRealtimeChatSessions();

	const renderContent = () => {
		if (isLoading)
			return <LoadingOverlay label='Loading conversations...' />;

		return sessions.map((s) => (
			<Button
				variant='ghost'
				className='flex items-center justify-between gap-4 group'
				key={s.name}
				selected={s.id === selectedSessionsId}
			>
				<p className='text-one-line flex-grow text-left'>{s.name}</p>

				<div className='items-center gap-2 hidden group-hover:flex group-[.selected]:flex'>
					<TooltipWrapper tooltip='delete' positionOffset={5}>
						<Trash
							className='action-button w-4 h-4'
							onClick={() => deleteChatSession(s.id, s.user_id)}
						/>
					</TooltipWrapper>
					<TooltipWrapper tooltip='rename' positionOffset={5}>
						<Pen className='action-button w-4 h-4' />
					</TooltipWrapper>
				</div>
			</Button>
		));
	};

	return (
		<div className='w-full h-full p-4 box-border outline'>
			<div className='w-full h-full flex flex-col'>{renderContent()}</div>
		</div>
	);
};

export default ChatSessions;
