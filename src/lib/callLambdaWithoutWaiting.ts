import { fetchWithTimeout } from './fetchWithTimeout';

export const callLambdaWithoutWaiting = (url: string, data: any) => {
	fetchWithTimeout(
		url,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
		8000
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log('Lambda call successful:', data);
		})
		.catch((error) => {
			console.error('Error calling Lambda:', error);
		});
};
