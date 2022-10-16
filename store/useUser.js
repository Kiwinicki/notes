import { useQuery } from '@tanstack/react-query';
import { Credentials, App } from 'realm-web';

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new App({ id: REALM_APP_ID });

export const useUser = ({ login, password }) =>
	useQuery(['user'], () => getUser({ login, password }));

//TODO: log out or swithing users
const getUser = async ({ login, password }) => {
	return new Promise((resolve, reject) => {
		try {
			const withLoginAndPasswd = login && password;
			let credentials = withLoginAndPasswd
				? Credentials.emailPassword(login, password)
				: Credentials.function();

			app.logIn(credentials).then((user) => {
				resolve({
					user,
					userType: withLoginAndPasswd ? userTypes.admin : userTypes.visitor,
				});
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const userTypes = Object.freeze({
	visitor: 'visitor',
	admin: 'admin',
});
