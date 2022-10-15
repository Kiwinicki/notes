import '../styles/globals.scss';
import useRealmStore from '../hooks/useRealmStore';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
	const logIn = useRealmStore((state) => state.logIn);
	const initDb = useRealmStore((state) => state.initDb);
	const getInitData = useRealmStore((state) => state.getInitData);

	useEffect(() => {
		(async () => {
			try {
				await logIn({});
				initDb();
				await getInitData();
			} catch (err) {
				console.error(err);
			}
		})();
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;
