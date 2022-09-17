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
			console.log(user.id);
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
	initDb: () =>
		set(({ user }) => {
			if (user !== null) {
				const realmService = user.mongoClient('mongodb-atlas');
				return { db: realmService.db('second-brain') };
			}
		}),

	notes: null,
	categories: null,
	getNotes: async () => {
		try {
			const notes = await get().db.collection('notes').find();
			set({ notes });
		} catch (err) {
			console.error(err);
		}
	},
	getCategories: async () => {
		try {
			const categories = await get().db.collection('categories').find();
			set({ categories });
		} catch (err) {
			console.error(err);
		}
	},
	switchUser: async (loginInfo) => {
		const resp = await get().logIn(loginInfo);
		get().app.switchUser(app.currentUser);
		get().initDb();
		get().getCategories();
		get().getNotes();
		return resp;
	},
}));

export default useRealmStore;
