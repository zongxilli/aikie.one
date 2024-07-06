import { fetchWithTimeout } from './fetchWithTimeout';

export const callLambdaWithoutWaiting = (url: string, data: any) => {
	fetchWithTimeout(
		url,
		{
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache', // 确保请求不会被缓存
			},
			body: JSON.stringify(data),
		},
		8000
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				console.log(`Non-OK response status: ${response.status}`);
				return null;
			}
		})
		.then((data) => {
			if (data) {
				console.log('Lambda call successful:', data);
			}
		})
		.catch((error) => {
			if (error.name === 'AbortError') {
				console.log('Lambda call timed out, but continuing execution');
			} else {
				console.log('Error calling Lambda:', error);
			}
		});
};
