import '../styles/globals.scss';
import useRealmStore from '../hooks/useRealmStore';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
	const logIn = useRealmStore((state) => state.logIn);
	const initDb = useRealmStore((state) => state.initDb);
	const getInitData = useRealmStore((state) => state.getInitData);

	useEffect(() => {
		(async () => {
			await logIn({});
			initDb();
			await getInitData();
		})();
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;
