import { useState, useCallback } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { LoginForm } from './LoginForm/LoginForm';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';
import { debounced } from '../../../../utils/debounced';
import Router from 'next/router';

export const Header = () => {
	const userType = useRealmStore((state) => state.userType);
	const switchUser = useRealmStore((state) => state.switchUser);
	const db = useRealmStore((state) => state.db);

	const [searchResults, setSearchResults] = useState([]);

	const {
		ref,
		state: isFormVisible,
		setState: setFormVisible,
	} = useOutsideClick();

	const bindedSearchNotes = useCallback(
		(ev) => searchNotes(ev, db, setSearchResults),
		[db, setSearchResults]
	);
	const handleSearch = debounced(500, bindedSearchNotes);

	return (
		<header className={styles.container}>
			<Link href="/">
				<span className={styles.logo}>Notatki</span>
			</Link>
			<div className={styles.searchContainer}>
				<form
					onSubmit={(ev) => {
						ev.preventDefault();
						Router.push({
							pathname: '/szukaj',
							query: { phrase: ev.target[0].value },
							// query: { category: ev.target[0].value },
							// query: { phrase_and_category: ev.target[0].value },
						});
					}}
				>
					<Input
						placeholder="Szukaj"
						onInput={handleSearch}
						className={styles.searchBar}
					/>
					<input type="submit" hidden />
				</form>
				<div className={styles.searchResults}>
					{searchResults.length > 0 ? (
						searchResults.map(({ title, _id }, i) => (
							<Link href={`/notatka/${_id.toString()}`} key={i}>
								{title}
							</Link>
						))
					) : (
						<p>brak wyników</p>
					)}
				</div>
			</div>
			{userType === userTypes.admin ? (
				<div className={styles.btnsContainer}>
					<ButtonLink href="/edytor">Dodaj notatkę</ButtonLink>
					<Button onClick={() => switchUser({})}>Wyloguj</Button>
				</div>
			) : (
				<div ref={ref} className={styles.loginContainer}>
					<Button onClick={() => setFormVisible((prev) => !prev)}>
						Zaloguj jako admin
					</Button>
					<LoginForm isVisible={isFormVisible} setVisible={setFormVisible} />
				</div>
			)}
		</header>
	);
};

const searchNotes = async (event, db, setSearchResults) => {
	const query = event.target.value;
	if (query) {
		try {
			const response = await db.collection('notes').aggregate([
				{
					$search: {
						index: 'searchNote',
						text: {
							query,
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
			setSearchResults(response);
			console.log(response);
		} catch (e) {
			console.warn(e);
		}
	}
};
