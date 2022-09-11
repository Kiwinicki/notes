import '../styles/globals.scss';
import useRealmStore from '../hooks/useRealmStore';
import { useEffect } from 'react';
// import RealmApp from '../providers/RealmApp';
// import MongoDB from '../providers/MongoDB';

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

	return (
		// <RealmApp>
		// <MongoDB>
		<Component {...pageProps} />
		// </MongoDB>
		// </RealmApp>
	);
}

export default MyApp;
