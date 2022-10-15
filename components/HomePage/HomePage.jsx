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
					try {
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
					} catch (err) {
						console.error(err);
					}
				} else {
					setMatchingNotes(notes);
				}
				if (router.query.tag) {
					console.log(router.query.tag);
					try {
						const response = await db
							.collection('notes')
							.find({ tags: { $in: [router.query.tag] } });

						console.log(response);
						setMatchingNotes(response);
					} catch (err) {
						console.error(err);
					}
				} else {
					setMatchingNotes(notes);
				}
			}
		})();
	}, [router.query, notes, db]);

	return (
		<div className={styles.notes}>
			{matchingNotes && matchingNotes?.length > 0 ? (
				matchingNotes.map((note, i) => <Note {...note} key={i} />)
			) : (
				<div className={styles.emptyResultContainer}>
					<p className={styles.emptyResultText}>
						Nie znaleziono notatek pasujących do podanej frazy lub tagu.
					</p>
				</div>
			)}
		</div>
	);
};
