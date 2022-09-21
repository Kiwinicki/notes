import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { Button } from '../shared/Button/Button';
import { serialize } from 'next-mdx-remote/serialize';
import { Note } from './Note/Note';
import useRealmStore, { userTypes } from '../../hooks/useRealmStore';
import { useRouter } from 'next/router';

export const Home = () => {
	const userType = useRealmStore((state) => state.userType);
	const notes = useRealmStore((state) => state.notes);
	const categories = useRealmStore((state) => state.categories);

	const [serializedNotes, setSerializedNotes] = useState(null);

	useEffect(() => {
		if (notes) {
			(async () => {
				const serialized = await Promise.all(
					notes.map((note) =>
						serialize(note.content).then((x) => ({ ...note, content: x }))
					)
				);
				setSerializedNotes(serialized);
			})();
		}
	}, [notes]);

	const router = useRouter();
	console.log(router.query);

	return (
		<main className={styles.main}>
			<aside className={styles.categories}>
				{categories &&
					categories.map((category, i) => (
						// TODO: filters notes by category onClick
						<Button key={i}>{category.name}</Button>
					))}
				{/* TODO: adding categories onClick */}
				{userType === userTypes.admin && <Button>Dodaj kategorię</Button>}
			</aside>
			<section className={styles.notes}>
				{serializedNotes &&
					serializedNotes.map((note, i) => <Note {...note} key={i} />)}
			</section>
		</main>
	);
};
