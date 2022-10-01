import Head from 'next/head';
import { Home } from '../components/HomePage/HomePage';
import { Layout } from '../components/shared/Layout/Layout';
import useRealmStore from '../hooks/useRealmStore';

export default function HomePage() {
	const notes = useRealmStore((state) => state.notes);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Home />
			</Layout>
		</>
	);
}
