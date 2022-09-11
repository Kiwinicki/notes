import { useState } from 'react';
import styles from './LoginForm.module.scss';
import { Button } from '../../shared/Button/Button';
import { Alert } from '../../shared/Alert/Alert';
import { Input } from '../../shared/Input/Input';
import useRealmStore from '../../../hooks/useRealmStore';

export const LoginForm = ({ isVisible, setVisible }) => {
	const logIn = useRealmStore((state) => state.logIn);
	const logOut = useRealmStore((state) => state.logOut);

	const [loginError, setLoginError] = useState(false);

	return (
		<form
			className={`${styles.form} ${isVisible ? '' : 'hidden'}`}
			onSubmit={(event) => {
				event.preventDefault();
				(async () => {
					logOut();
					const resp = await logIn({
						login: event.target[0].value,
						password: event.target[1].value,
					});
					setVisible((prev) => (resp ? false : prev));
					setLoginError(resp ? false : true);
				})();
			}}
		>
			<label htmlFor="login" className="srOnly">
				login
			</label>
			<Input type="text" name="login" id="login" placeholder="login" />
			<label htmlFor="password" className="srOnly">
				hasło
			</label>
			<Input
				type="password"
				name="password"
				id="password"
				placeholder="hasło"
			/>
			<Button type="submit">Zaloguj jako admin</Button>
			{loginError && <Alert type="error">Nie udało się zalogować</Alert>}
		</form>
	);
};
