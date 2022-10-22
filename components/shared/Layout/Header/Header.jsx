import styles from './Header.module.scss';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { LoginForm } from './LoginForm/LoginForm';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { debounced } from '../../../../utils/debounced';
import { useApp, userTypes } from '../../../../store/useApp';
import { useNotes } from '../../../../store/useNotes';

export const Header = () => {
	const {
		ref,
		state: isFormVisible,
		setState: setFormVisible,
	} = useOutsideClick();

	const [phrase, setPhrase] = useState('');

	const [{ data: userData, isSuccess: appSuccess }, logIn] = useApp();
	const { data: noteData, isSuccess: noteSuccess } = useNotes({ phrase });

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
							pathname: '/',
							query: { phrase: ev.target[0].value },
							// TODO: filtering by category
							// query: { category: ev.target[0].value },
							// query: { phrase_and_category: ev.target[0].value },
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
				{noteSuccess && (
					<div className={styles.searchResults}>
						{noteData.length > 0 ? (
							noteData.map(({ title, _id }, i) => (
								<Link href={`/note/${_id.toString()}`} key={i}>
									{title}
								</Link>
							))
						) : (
							<p>brak wyników</p>
						)}
					</div>
				)}
			</div>
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

// const searchNotes = async (event, db, setSearchResults) => {
// 	const query = event.target.value;
// 	if (query) {
// 		try {
// 			const response = await db.collection('notes').aggregate([
// 				{
// 					$search: {
// 						index: 'searchNote',
// 						text: {
// 							query,
// 							path: {
// 								wildcard: '*',
// 							},
// 							fuzzy: {
// 								maxEdits: 1,
// 								maxExpansions: 1,
// 							},
// 						},
// 					},
// 				},
// 				{
// 					$limit: 10,
// 				},
// 			]);
// 			setSearchResults(response);
// 			console.log(response);
// 		} catch (e) {
// 			console.warn(e);
// 		}
// 	}
// };
