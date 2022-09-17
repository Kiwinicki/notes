import Link from 'next/link';
import styles from './Header.module.scss';
import { Button, ButtonLink } from '../../shared/Button/Button';
import { Input } from '../../shared/Input/Input';
import { LoginForm } from '../LoginForm/LoginForm';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import useRealmStore, { userTypes } from '../../../hooks/useRealmStore';

export const Header = () => {
	const userType = useRealmStore((state) => state.userType);
	const switchUser = useRealmStore((state) => state.switchUser);

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
			<Input placeholder="Szukaj" />
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
