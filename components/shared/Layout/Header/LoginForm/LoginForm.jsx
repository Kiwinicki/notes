import styles from './LoginForm.module.scss';
import { Button } from '../../../Button/Button';
import { Alert } from '../../../Alert/Alert';
import { Input } from '../../../Input/Input';
import { useEffect } from 'react';
import { useApp } from '../../../../../store/useApp';

export const LoginForm = ({ isVisible, setVisible }) => {
	const [{ isError, isSuccess }, logIn] = useApp();

	useEffect(() => {
		setVisible((prev) => (isSuccess ? false : prev));
	}, [isSuccess]);

	return (
		<form
			className={`${styles.form} ${isVisible ? '' : 'hidden'}`}
			onSubmit={(event) => {
				event.preventDefault();

				logIn({
					login: event.target[0].value,
					password: event.target[1].value,
				});

				setVisible((prev) => (isSuccess ? false : prev));
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
			{isError && <Alert type="error">Nie udało się zalogować</Alert>}
		</form>
	);
};
