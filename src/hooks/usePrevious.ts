'use client';

import { useEffect, useRef } from 'react';

// custom hook for getting previous value
export default function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}
