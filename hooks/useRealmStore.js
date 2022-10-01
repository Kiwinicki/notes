import create from 'zustand';
import * as RealmWeb from 'realm-web';

export const userTypes = {
	visitor: 'visitor',
	admin: 'admin',
	none: 'none',
};

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new RealmWeb.App({ id: REALM_APP_ID });

const useRealmStore = create((set, get) => ({
	app,
	user: null,
	userType: userTypes.none,
	logIn: async ({ login, password }) => {
		const withLoginAndPasswd = login && password;
		let credentials = withLoginAndPasswd
			? RealmWeb.Credentials.emailPassword(login, password)
			: RealmWeb.Credentials.function();

		try {
			const user = await app.logIn(credentials);
			set({
				user: app.currentUser,
				userType: withLoginAndPasswd ? userTypes.admin : userTypes.visitor,
			});
		} catch (err) {
			console.error('Failed to log in', err);
			set({
				user: null,
				userType: withLoginAndPasswd ? userTypes.visitor : userTypes.none,
			});
		}
	},
	logOut: () => {
		if (get().user !== null) {
			get().user.logOut();
			set({
				user: null,
				userType: userTypes.none,
			});
		}
	},
	db: null,
	initDb: () => {
		if (get().user !== null) {
			const realmService = get().user.mongoClient('mongodb-atlas');
			set({ db: realmService.db('second-brain') });
		} else {
			console.error("Couldn't initialize database without user logged in");
		}
	},
	notes: null,
	tags: null,
	getInitData: async () => {
		try {
			if (get().user) {
				const { notes, tags } = await get().user.functions.getInitData();
				set({ notes, tags });
			}
		} catch (err) {
			console.error(err);
		}
	},
	switchUser: async (loginInfo) => {
		try {
			const resp = await get().logIn(loginInfo);
			get().app.switchUser(app.currentUser);
			get().initDb();
			get().getInitData();
			return resp;
		} catch (err) {
			console.error(err);
		}
	},
	initApp: async () => {
		await logIn({});
		initDb();
		await getInitData();
	},
}));

export default useRealmStore;
