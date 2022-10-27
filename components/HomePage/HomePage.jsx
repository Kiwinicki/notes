import { useEffect } from 'react';
import styles from './HomePage.module.scss';
import { Note } from './Note/Note';
import { useRouter } from 'next/router';
import { useNotes } from '../../store/useNotes';
import { Loader } from '../shared/Loader/Loader';

export const Home = () => {
	const { query } = useRouter();

	const [{ data: notes, isLoading, isSuccess, isError }] = useNotes({
		phrase: query.phrase,
		tag: query.tag,
	});

	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<Loader />
			</div>
		);
	}

	if (isError) {
		return <p>Wystąpił problem z pobieraniem notatek</p>;
	}

	if (isSuccess) {
		return (
			<div className={styles.notes}>
				{notes.length > 0 ? (
					notes.map((note, i) => <Note {...note} key={i} />)
				) : (
					<div className={styles.emptyResultContainer}>
						<p className={styles.emptyResultText}>
							Nie znaleziono notatek pasujących do podanej frazy lub tagu.
						</p>
					</div>
				)}
			</div>
		);
	}
};
