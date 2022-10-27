import styles from './Header.module.scss';
import { useState } from 'react';
import { ListIcon } from '../../../../assets/ListIcon';
import Router from 'next/router';
import { Button, ButtonLink } from '../../Button/Button';

import { LoginForm } from './LoginForm/LoginForm';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { useApp, userTypes } from '../../../../store/useApp';
import { useNotes } from '../../../../store/useNotes';
import { useDebounce } from 'use-debounce';
import { Logo } from '../../Logo/Logo';
import { NoteSearchBar } from './NoteSearchBar/NoteSearBar';

export const Header = ({ toggleTagMenu }) => {
	const {
		ref,
		state: isFormVisible,
		setState: setFormVisible,
	} = useOutsideClick();

	const [{ data: userData, isSuccess }, logIn] = useApp();

	return (
		<header className={styles.container}>
			<div className={styles.leftContainer}>
				<TagMenuButton onClick={toggleTagMenu} />
				<Logo />
			</div>
			<NoteSearchBar />
			{isSuccess && (
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

const TagMenuButton = (props) => {
	return (
		<Button {...props} className={styles.menuButton}>
			<ListIcon />
		</Button>
	);
};
