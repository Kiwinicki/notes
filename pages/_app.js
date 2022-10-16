import '../styles/globals.scss';
import useRealmStore from '../hooks/useRealmStore';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useUser } from '../store/useUser';
import { useDb } from '../store/useDb';

const client = new QueryClient();

const InitQuery = ({ children }) => {
	useUser({});
	useDb();

	return <>{children}</>;
};

function MyApp({ Component, pageProps }) {
	// const logIn = useRealmStore((state) => state.logIn);
	// const initDb = useRealmStore((state) => state.initDb);
	// const getInitData = useRealmStore((state) => state.getInitData);

	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			await logIn({});
	// 			initDb();
	// 			await getInitData();
	// 		} catch (err) {
	// 			console.error(err);
	// 		}
	// 	})();
	// }, []);

	// const { data: notes } = useNotes();
	// const { data: tags } = useTags();

	return (
		<QueryClientProvider client={client}>
			<InitQuery>
				<Component {...pageProps} />;
			</InitQuery>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default MyApp;
