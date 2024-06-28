export const commonUtils = {
	isEqual: (value1: any, value2: any) => {
		// 处理基本类型和 null
		if (value1 === value2) return true;

		// 如果其中一个是 null 或不是对象，它们不相等
		if (
			typeof value1 !== 'object' ||
			value1 === null ||
			typeof value2 !== 'object' ||
			value2 === null
		) {
			return false;
		}

		// 处理日期
		if (value1 instanceof Date && value2 instanceof Date) {
			return value1.getTime() === value2.getTime();
		}

		// 处理数组
		if (Array.isArray(value1) && Array.isArray(value2)) {
			if (value1.length !== value2.length) return false;
			for (let i = 0; i < value1.length; i++) {
				if (!commonUtils.isEqual(value1[i], value2[i])) return false;
			}
			return true;
		}

		// 处理普通对象
		if (!Array.isArray(value1) && !Array.isArray(value2)) {
			const keys1 = Object.keys(value1);
			const keys2 = Object.keys(value2);

			if (keys1.length !== keys2.length) return false;

			for (const key of keys1) {
				if (!keys2.includes(key)) return false;
				if (!commonUtils.isEqual(value1[key], value2[key]))
					return false;
			}

			return true;
		}

		// 如果走到这里，说明类型不匹配（例如，一个是数组，一个是对象）
		return false;
	},
};
