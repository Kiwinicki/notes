import { useState, useEffect } from 'react';
import styles from './HomePage.module.scss';
import { Note } from './Note/Note';
import useRealmStore from '../../hooks/useRealmStore';
import { useRouter } from 'next/router';

export const Home = () => {
	const notes = useRealmStore((state) => state.notes);
	const db = useRealmStore((state) => state.db);

	const [matchingNotes, setMatchingNotes] = useState(notes);

	const router = useRouter();
	useEffect(() => {
		(async () => {
			if (db) {
				if (router.query.phrase) {
					console.log(router.query.phrase);
					const response = await db.collection('notes').aggregate([
						{
							$search: {
								index: 'searchNote',
								text: {
									query: router.query.phrase,
									path: {
										wildcard: '*',
									},
									fuzzy: {
										maxEdits: 1,
										maxExpansions: 1,
									},
								},
							},
						},
					]);
					setMatchingNotes(response);
				} else {
					setMatchingNotes(notes);
				}
			}
		})();
	}, [router.query, notes, db]);

	return (
		<main className={styles.notes}>
			{matchingNotes &&
				matchingNotes.map((note, i) => <Note {...note} key={i} />)}
		</main>
	);
};
