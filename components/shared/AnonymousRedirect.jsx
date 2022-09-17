import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useRealmStore, { userTypes } from '../../hooks/useRealmStore';

export const AnonymousRedirect = ({ children, redirectTo = '/' }) => {
	const userType = useRealmStore((state) => state.userType);
	const router = useRouter();

	useEffect(() => {
		if (userType !== userTypes.admin) {
			router.push({
				pathname: redirectTo,
			});
		}
	}, [userType]);

	if (userType === userTypes.admin) {
		return children;
	} else {
		return <p>Przekierowywanie...</p>;
	}
};
