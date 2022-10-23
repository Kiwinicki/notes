import React from 'react';
import styles from './EditorNavBar.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import { Button } from '../Button/Button';

export const EditorNavBar = () => {
	const [{ data }] = useApp();

	// if (data.userType === userTypes.admin) {
	return (
		<nav className={styles.container}>
			belka z opcjami
			<Button>Edytor</Button>
			<Button>Podgląd</Button>
			<Button>Zapisz</Button>
		</nav>
	);
	// }
};
