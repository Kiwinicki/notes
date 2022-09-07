import '../styles/globals.scss';
import RealmApp from '../providers/RealmApp';
import MongoDB from '../providers/MongoDB';

function MyApp({ Component, pageProps }) {
	return (
		<RealmApp>
			<MongoDB>
				<Component {...pageProps} />
			</MongoDB>
		</RealmApp>
	);
}

export default MyApp;
