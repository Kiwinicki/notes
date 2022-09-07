import { useEffect, useRef, useState } from 'react';

export const useOutsideClick = () => {
	const [state, setState] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			console.log(event.target);
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
