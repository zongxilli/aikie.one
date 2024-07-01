import { Separator } from '@/components/ui/separator';

const TermsOfServicePage = () => {
	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-4xl font-bold mb-6'>Terms of Service</h1>

			<div className='space-y-8'>
				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						1. Acceptance of Terms
					</h2>
					<p className='text-muted-foreground'>
						By accessing and using [Your App Name] (the
						&quot;Service&quot;), you agree to be bound by these
						Terms of Service (&quot;Terms&quot;). If you disagree
						with any part of the terms, you may not access the
						Service.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						2. Use of the Service
					</h2>
					<p className='text-muted-foreground'>
						You agree to use the Service only for purposes that are
						permitted by these Terms and any applicable law,
						regulation, or generally accepted practices or
						guidelines in the relevant jurisdictions.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						3. User Accounts
					</h2>
					<p className='text-muted-foreground'>
						When you create an account with us, you must provide
						information that is accurate, complete, and current at
						all times. Failure to do so constitutes a breach of the
						Terms, which may result in immediate termination of your
						account on our Service.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						4. Intellectual Property
					</h2>
					<p className='text-muted-foreground'>
						The Service and its original content, features, and
						functionality are and will remain the exclusive property
						of [Your Company Name] and its licensors.
					</p>
				</section>

				<Separator />

				<section>
					<h2 className='text-2xl font-semibold mb-4'>
						5. Termination
					</h2>
					<p className='text-muted-foreground'>
						We may terminate or suspend your account immediately,
						without prior notice or liability, for any reason
						whatsoever, including without limitation if you breach
						the Terms.
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

export default TermsOfServicePage;
