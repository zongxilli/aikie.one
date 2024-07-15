export const formatUtils = {
	formatDate: (date: Date, includeTime: boolean = false) => {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		};

		if (includeTime) {
			options.hour = '2-digit';
			options.minute = '2-digit';
			options.second = '2-digit';
		}

		const formattedDate = date.toLocaleDateString('en-US', options);

		return formattedDate;
	},
};
