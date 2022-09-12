import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.scss';
import { Button } from '../../shared/Button/Button';
import * as RealmWeb from 'realm-web';
import { LoginForm } from '../LoginForm/LoginForm';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import useRealmStore, { userTypes } from '../../../hooks/useRealmStore';

export const Header = () => {
	// const {
	// 	BSON: { ObjectId },
	// } = RealmWeb;

	const userType = useRealmStore((state) => state.userType);
	const logIn = useRealmStore((state) => state.logIn);
	const logOut = useRealmStore((state) => state.logOut);

	const {
		ref,
		state: isFormVisible,
		setState: setFormVisible,
	} = useOutsideClick();

	return (
		<header className={styles.container}>
			<Link href="/">
				<span className={styles.logo}>Notatki</span>
			</Link>
			<input type="text" className={styles.searchBar} placeholder="Szukaj" />
			{userType === userTypes.admin ? (
				<div className={styles.btnsContainer}>
					<Link
						href="/edytor"
						// onClick={async () => {
						// 	const resp = await db
						// 		.collection('notes')
						// 		.insertOne({
						// 			title: 'Angular jest spoko',
						// 			content: 'MDX content o angularze2',
						// 			category: new ObjectId('6310ad9a88de2873936bb463'),
						// 			public: true,
						// 		})
						// 		.catch((err) => console.warn(err));
						// 	console.log(resp);
						// }}
					>
						Dodaj notatkę
					</Link>
					<Button
						onClick={() => {
							logOut();
							logIn({});
						}}
					>
						Wyloguj
					</Button>
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
