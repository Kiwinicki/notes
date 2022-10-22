import styles from './Header.module.scss';
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { LoginForm } from './LoginForm/LoginForm';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { useApp, userTypes } from '../../../../store/useApp';
import { useNotes } from '../../../../store/useNotes';
import { useDebounce } from 'use-debounce';

export const Header = () => {
	const {
		ref,
		state: isFormVisible,
		setState: setFormVisible,
	} = useOutsideClick();

	const [phrase, setPhrase] = useState('');
	const [debouncedPhrase] = useDebounce(phrase, 500);

	const [{ data: userData, isSuccess: appSuccess }, logIn] = useApp();
	const {
		data: foundNotes,
		isSuccess: searchSuccess,
		isError: searchError,
		isLoading: searchLoading,
	} = useNotes({ phrase: debouncedPhrase });

	return (
		<header className={styles.container}>
			<Link href="/">
				<span className={styles.logo}>Notatki</span>
			</Link>
			<NoteSearchBar
				{...{
					phrase,
					setPhrase,
					foundNotes,
					searchSuccess,
					searchError,
					searchLoading,
				}}
			/>
			{appSuccess && (
				<>
					{userData.userType === userTypes.admin ? (
						<div className={styles.btnsContainer}>
							<ButtonLink href="/new">Dodaj notatkę</ButtonLink>
							<Button onClick={() => logIn({})}>Wyloguj</Button>
						</div>
					) : (
						<div ref={ref} className={styles.loginContainer}>
							<Button onClick={() => setFormVisible((prev) => !prev)}>
								Zaloguj jako admin
							</Button>
							<LoginForm
								isVisible={isFormVisible}
								setVisible={setFormVisible}
							/>
						</div>
					)}
				</>
			)}
		</header>
	);
};

const NoteSearchBar = ({
	phrase,
	setPhrase,
	foundNotes,
	searchSuccess,
	searchError,
	searchLoading,
}) => {
	return (
		<div className={styles.searchContainer}>
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
			{searchSuccess && (
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
			{searchError && <p>Wystąpił błąd podczas szukania notatek</p>}
			{searchLoading && <p>Szukam...</p>}
		</div>
	);
};
