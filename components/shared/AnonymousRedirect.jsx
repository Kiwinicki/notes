import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp, userTypes } from '../../store/useApp';

export const AnonymousRedirect = ({ children, redirectTo = '/' }) => {
	const [{ data }] = useApp();
	const router = useRouter();

	useEffect(() => {
		if (data.userType !== userTypes.admin) {
			router.push({
				pathname: redirectTo,
			});
		}
	}, [data.userType]);

	if (data.userType === userTypes.admin) {
		return children;
	} else {
		return <p>Przekierowywanie...</p>;
	}
};
