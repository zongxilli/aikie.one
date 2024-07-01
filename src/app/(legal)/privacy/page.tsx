import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-4xl font-bold mb-6'>Privacy Policy</h1>

			<div className='space-y-8'>
				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						1. Information We Collect
					</h2>
					<p className='text-muted-foreground'>
						We collect information you provide directly to us, such
						as when you create or modify your account, request
						customer support, or communicate with us. This
						information may include your name, email address, and
						phone number.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						2. How We Use Your Information
					</h2>
					<p className='text-muted-foreground'>
						We use the information we collect to operate, maintain,
						and provide you with the features and functionality of
						the Service, as well as to communicate directly with
						you, such as to send you email messages and push
						notifications.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						3. Sharing of Your Information
					</h2>
					<p className='text-muted-foreground'>
						We do not share, sell, rent, or trade your personal
						information with third parties for their commercial
						purposes without your explicit consent.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						4. Data Security
					</h2>
					<p className='text-muted-foreground'>
						We use appropriate technical and organizational measures
						to protect the personal information that we collect and
						process about you. The measures we use are designed to
						provide a level of security appropriate to the risk of
						processing your personal information.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						5. Your Rights
					</h2>
					<p className='text-muted-foreground'>
						You have the right to access, update, or delete your
						personal information. You can object to processing of
						your personal information, ask us to restrict processing
						of your personal information or request portability of
						your personal information.
					</p>
				</section>

				<Separator />

				<p className='text-sm text-muted-foreground'>
					Last updated: 2024-06-30
				</p>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
