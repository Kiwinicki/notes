import { useState } from 'react';

export const useToggle = (initState = false) => {
	const [state, setState] = useState(initState);

	const toggler = (state) =>
		setState((prevState) => (typeof state == 'boolean' ? state : !prevState));

	return [state, toggler];
};
