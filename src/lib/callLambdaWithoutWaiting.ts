export const fetchWithTimeout = async (
	url: string,
	options: RequestInit = {},
	timeout: number = 8000
): Promise<Response> => {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	console.log('fetchWithTimeout 函数');

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(id);
		return response;
	} catch (error: unknown) {
		clearTimeout(id);
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				throw new Error('Request timed out');
			}
			throw error;
		}
		// 如果不是 Error 实例，则抛出一个新的 Error
		throw new Error('An unknown error occurred');
	}
};

export const callLambdaWithoutWaiting = (url: string, data: any) => {
	console.log('callLambdaWithoutWaiting 函数');

	fetchWithTimeout(
		url,
		{
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
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
			if (error instanceof Error) {
				if (error.message === 'Request timed out') {
					console.log(
						'Lambda call timed out, but continuing execution'
					);
				} else {
					console.log('Error calling Lambda:', error.message);
				}
			} else {
				console.log('An unknown error occurred');
			}
		});
};
