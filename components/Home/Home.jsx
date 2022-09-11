import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { Button } from '../shared/Button/Button';
import { userTypes } from '../../providers/RealmApp';
import { serialize } from 'next-mdx-remote/serialize';
import { Note } from './Note/Note';
import useRealmStore from '../../hooks/useRealmStore';

export const Home = () => {
	const userType = useRealmStore((state) => state.userType);
	const notes = useRealmStore((state) => state.notes);
	const categories = useRealmStore((state) => state.categories);

	console.log(categories);

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
