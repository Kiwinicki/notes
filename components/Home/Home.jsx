import { useState, useEffect } from 'react';
import styles from './Home.module.scss';
import { useRealmApp } from '../../providers/RealmApp';
import { useMongoDB } from '../../providers/MongoDB';
import { Button } from '../shared/Button/Button';
import { userTypes } from '../../providers/RealmApp';
import { serialize } from 'next-mdx-remote/serialize';
import { Note } from './Note/Note';

export const Home = () => {
	const { user, userType } = useRealmApp();
	const [data, setData] = useState(null);

	// initial anonymous login in RealmApp

	useEffect(() => {
		(async () => {
			if (user) {
				const allData = await user.functions.getInitData();
				console.log(allData);

				allData.notes.forEach(async (note) => {
					note.content = await serialize(note.content);
				});
				setData(allData);
			}
		})();
	}, [user]);

	return (
		<main className={styles.main}>
			<aside className={styles.categories}>
				{data &&
					data.categories.map((category, i) => (
						// TODO: filters notes by category onClick
						<Button key={i}>{category.name}</Button>
					))}
				{/* TODO: adding categories onClick */}
				{userType === userTypes.admin && <Button>Dodaj kategorię</Button>}
			</aside>
			<section className={styles.notes}>
				{data && data.notes.map((note, i) => <Note {...note} key={i} />)}
			</section>
		</main>
	);
};
