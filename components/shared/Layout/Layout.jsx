import styles from './Layout.module.scss';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { TagsSidebar } from './TagsSidebar/TagsSidebar';
import { Loader } from '../Loader/Loader';
import { Button } from '../Button/Button';
import useRealmStore, { loginStatus } from '../../../hooks/useRealmStore';

export const Layout = ({ children }) => {
	const userStatus = useRealmStore((state) => state.userStatus);
	const logIn = useRealmStore((state) => state.logIn);
	const initDb = useRealmStore((state) => state.initDb);
	const getInitData = useRealmStore((state) => state.getInitData);

	const retryLoginAnonymous = async () => {
		try {
			await logIn({});
			initDb();
			await getInitData();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<TagsSidebar />
				{userStatus === loginStatus.loggedIn ? (
					children
				) : userStatus === loginStatus.loading ? (
					<div className={styles.loadingContainer}>
						<Loader />
						<p>logowanie...</p>
					</div>
				) : (
					<div className={styles.errorContainer}>
						<p>problem z logowaniem</p>
						{/* TODO: check refetching with internet */}
						<Button onClick={retryLoginAnonymous}>Spróbuj ponownie</Button>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
};
