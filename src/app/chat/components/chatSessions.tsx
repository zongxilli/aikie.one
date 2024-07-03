import { Ellipsis } from 'lucide-react';

import { LoadingOverlay } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useRealtimeChatSessions } from '@/db/supabase-subscriptions/useRealtimeChatSessions';

const ChatSessions = () => {
	const { sessions, isLoading } = useRealtimeChatSessions();

	const renderContent = () => {
		if (isLoading)
			return <LoadingOverlay label='Loading conversations...' />;

		return sessions.map((s) => (
			<Button
				variant='ghost'
				className='flex items-center justify-between gap-4'
				key={s.name}
			>
				<p className='text-one-line'>{s.name}</p>

				<Ellipsis className='action-button' />
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
