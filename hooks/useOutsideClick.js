import { useEffect, useRef, useState } from 'react';

export const useOutsideClick = () => {
	const [state, setState] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setState(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	return { ref, state, setState };
};
