import '../styles/globals.scss';
import useRealmStore from '../hooks/useRealmStore';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
	const { logIn, initDb, getNotes, getCategories, db } = useRealmStore(
		({ logIn, initDb, getNotes, getCategories, db }) => ({
			logIn,
			initDb,
			getNotes,
			getCategories,
			db,
		})
	);

	useEffect(() => {
		(async () => {
			await logIn({});
			await initDb();
		})();
	}, []);

	useEffect(() => {
		if (db) {
			getNotes();
			getCategories();
		}
	}, [db]);

	return <Component {...pageProps} />;
}

export default MyApp;
