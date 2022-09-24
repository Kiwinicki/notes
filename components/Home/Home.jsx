import styles from './Home.module.scss';
import { Note } from './Note/Note';
import useRealmStore, { userTypes } from '../../hooks/useRealmStore';
import { useRouter } from 'next/router';

export const Home = () => {
	const notes = useRealmStore((state) => state.notes);
	// const userType = useRealmStore((state) => state.userType);
	// const categories = useRealmStore((state) => state.categories);

	const router = useRouter();
	console.log(router.query);
	// useEffect(() => {
	// }, [router.query])

	return (
		<section className={styles.notes}>
			{notes && notes.map((note, i) => <Note {...note} key={i} />)}
		</section>
	);
};
