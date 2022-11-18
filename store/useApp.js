import { Credentials, App } from 'realm-web';
import { useQuery } from '@tanstack/react-query';
import create from 'zustand';
import { persist } from 'zustand/middleware';

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
export const app = new App({ id: REALM_APP_ID });

const useKeysStore = create(
	persist((set) => ({
		appQueryKey: ['app', { login: '', password: '' }],
		setAppQueryKey: (key) => set({ appQueryKey: key }),
	})),
	{ name: 'auth-store', getStorage: () => sessionStorage }
);

export const userTypes = Object.freeze({
	visitor: 'visitor',
	admin: 'admin',
	none: 'none',
});

const logIn = async (login, password) => {
	const withLoginAndPasswd = login && password;
	let credentials = withLoginAndPasswd
		? Credentials.emailPassword(login, password)
		: Credentials.function();

	return await app.logIn(credentials);
};

const getApp = ({ login, password }) => {
	return new Promise((resolve, reject) => {
		const withLoginAndPasswd = login && password;

		try {
			logIn(login, password).then(() => {
				if (app.currentUser.isLoggedIn) app.switchUser(app.currentUser);

				const db = app.currentUser
					.mongoClient('mongodb-atlas')
					.db('second-brain');

				resolve({
					user: app.currentUser,
					userType: withLoginAndPasswd
						? userTypes.admin
						: userTypes.visitor,
					db,
				});
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const useApp = () => {
	const appQueryKey = useKeysStore((state) => state.appQueryKey);
	const setAppKey = useKeysStore((state) => state.setAppQueryKey);

	const logIn = ({ login, password }) => {
		setAppKey(['app', { login, password }]);
	};

	const appState = useQuery(appQueryKey, () => getApp(appQueryKey[1]), {
		cacheTime: 60 * 60 * 1000, // 1h
		initialData: {
			user: null,
			userType: userTypes.none,
			db: null,
		},
	});

	return [appState, logIn];
};
