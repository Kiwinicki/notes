import { useState } from 'react';
import styles from './NoteSearchBar.module.scss';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { useNotes } from '../../../../../store/useNotes';
import { Input } from '../../../Input/Input';

export const NoteSearchBar = () => {
	const [phrase, setPhrase] = useState('');
	const [debouncedPhrase] = useDebounce(phrase, 500);

	const [{ data, isSuccess, isError, isLoading }] = useNotes({
		phrase: debouncedPhrase,
	});

	return (
		<div className={styles.container}>
			<form
				onSubmit={(ev) => {
					ev.preventDefault();
					Router.push({
						pathname: '/',
						query: { phrase: ev.target[0].value },
					});
				}}
			>
				<Input
					placeholder="Szukaj"
					value={phrase}
					onChange={(ev) => setPhrase(ev.target.value)}
					className={styles.searchBar}
					onBlur={() => setPhrase('')}
				/>
				<input type="submit" hidden />
			</form>
			{isSuccess && (
				<div className={styles.searchResults}>
					{phrase === '' ? (
						<p>Zacznij szukać</p>
					) : foundNotes.length > 0 ? (
						foundNotes.map(({ title, _id }, i) => (
							<Link href={`/note/${_id.toString()}`} key={i}>
								{title}
							</Link>
						))
					) : (
						<p>Brak wyników</p>
					)}
				</div>
			)}
			{isError && <p>Wystąpił błąd podczas szukania notatek</p>}
			{isLoading && <p>Szukam...</p>}
		</div>
	);
};
