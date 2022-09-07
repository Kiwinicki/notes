import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { useRealmApp } from '../../providers/RealmApp';
import { useMongoDB } from '../../providers/MongoDB';
import { Button } from '../shared/Button/Button';

export const Home = () => {
	const { user } = useRealmApp();
	const [data, setData] = useState(null);

	// initial anonymous login in RealmApp

	useEffect(() => {
		(async () => {
			if (user) {
				const allData = await user.functions.getInitData();
				console.log(allData);
				setData(allData);
			}
		})();
	}, [user]);

	return (
		<main className={styles.main}>
			<aside className={styles.categories}>
				{data &&
					data.categories.map((category, i) => (
						<Button key={i}>{category.name}</Button>
					))}
				<Button>Dodaj kategorię</Button>
			</aside>
			<section className={styles.notes}>
				{data &&
					data.notes.map((note, i) => (
						<div className={styles.note} key={i}>
							<h2 className={styles.noteTitle}>{note.title}</h2>
							<p className={styles.noteContent}>{note.content}</p>
						</div>
					))}
			</section>
		</main>
	);
};
