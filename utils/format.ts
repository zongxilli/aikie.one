export const formatUtils = {
	formatDateTime: (
		dateInput: Date | string | number,
		options: {
			format?: 'short' | 'medium' | 'long';
			includeTime?: boolean;
			locale?: string;
		} = {}
	) => {
		const {
			format = 'medium',
			includeTime = true,
			locale = 'en-US',
		} = options;

		// 确保我们有一个有效的 Date 对象
		const date =
			dateInput instanceof Date ? dateInput : new Date(dateInput);

		// 检查日期是否有效
		if (isNaN(date.getTime())) {
			console.error('Invalid date input:', dateInput);
			return 'Invalid Date';
		}

		const dateFormatOptions: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: format === 'short' ? 'short' : 'long',
			day: 'numeric',
		};

		const timeFormatOptions: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		};

		if (format === 'long') {
			timeFormatOptions.second = '2-digit';
		}

		const dateFormatter = new Intl.DateTimeFormat(
			locale,
			dateFormatOptions
		);
		const timeFormatter = new Intl.DateTimeFormat(
			locale,
			timeFormatOptions
		);

		try {
			const formattedDate = dateFormatter.format(date);
			const formattedTime = includeTime ? timeFormatter.format(date) : '';

			return includeTime
				? `${formattedDate} at ${formattedTime}`
				: formattedDate;
		} catch (error) {
			console.error('Error formatting date:', error);
			return 'Date formatting error';
		}
	},
};
