import styles from './Header.module.scss';
import { useState } from 'react';

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
			<TagMenuButton onClick={toggleTagMenu} />
			<Logo />
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
		<Button {...props}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					fillRule="evenodd"
					d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
				/>
			</svg>
		</Button>
	);
};
