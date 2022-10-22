import '../styles/globals.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

function MyApp({ Component, pageProps }) {
	return (
		<QueryClientProvider client={client}>
			<Component {...pageProps} />
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default MyApp;
