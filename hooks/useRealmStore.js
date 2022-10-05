import create from 'zustand';
import { devtools } from 'zustand/middleware';
import * as RealmWeb from 'realm-web';

const { ObjectId } = RealmWeb.BSON;

export const userTypes = {
	visitor: 'visitor',
	admin: 'admin',
	none: 'none',
};

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new RealmWeb.App({ id: REALM_APP_ID });

const useRealmStore = create(
	devtools(
		(set, get) => ({
			app,
			user: null,
			userType: userTypes.none,
			db: null,
			notes: null,
			tags: null,
			logIn: async ({ login, password }) => {
				const withLoginAndPasswd = login && password;
				let credentials = withLoginAndPasswd
					? RealmWeb.Credentials.emailPassword(login, password)
					: RealmWeb.Credentials.function();

				try {
					const user = await app.logIn(credentials);
					set(
						{
							user: app.currentUser,
							userType: withLoginAndPasswd
								? userTypes.admin
								: userTypes.visitor,
						},
						false,
						'realmStore/logIn'
					);
				} catch (err) {
					console.error('Failed to log in', err);
					set(
						{
							user: null,
							userType: withLoginAndPasswd ? userTypes.visitor : userTypes.none,
						},
						false,
						'realmStore/logIn'
					);
				}
			},
			logOut: () => {
				if (get().user !== null) {
					get().user.logOut();
					set(
						{
							user: null,
							userType: userTypes.none,
						},
						false,
						'realmStore/logOut'
					);
				}
			},
			initDb: () => {
				if (get().user !== null) {
					const realmService = get().user.mongoClient('mongodb-atlas');
					set(
						{ db: realmService.db('second-brain') },
						false,
						'realmStore/initDb'
					);
				} else {
					console.error("Couldn't initialize database without user logged in");
				}
			},
			getInitData: async () => {
				try {
					if (get().user) {
						const { notes, tags } = await get().user.functions.getInitData();
						set({ notes, tags }, false, 'realmStore/getInitData');
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
			addNote: async ({ title, content, tags, isPublic }) => {
				if (
					title !== undefined &&
					content !== undefined &&
					tags !== undefined &&
					isPublic !== undefined
				) {
					const newNote = {
						title,
						content,
						tags,
						isPublic,
						editDate: new Date(),
					};
					if (get().db) {
						try {
							const insertedId = await get()
								.db.collection('notes')
								.insertOne(newNote);

							set(
								(state) => ({
									notes: [...state.notes, { ...newNote, _id: insertedId }],
								}),
								false,
								'realmStore/addNote'
							);
							return insertedId;
						} catch (err) {
							console.error(err);
						}
					} else {
						throw new Error('Not provided required note fields');
					}
				}
			},
			searchNoteById: async (noteId) => {
				let id = noteId;
				if (typeof noteId === 'string') id = ObjectId(noteId);

				const noteFromStore = get().notes.find((note) => note._id === id);
				if (!noteFromStore) {
					const noteFromDB = await get()
						.db.collection('notes')
						.findOne({ _id: id });

					if (!noteFromDB) return null;
					return noteFromDB;
				}
				return noteFromStore;
			},
			updateNote: async ({ noteId, title, content, tags, isPublic }) => {
				if (
					noteId !== undefined &&
					title !== undefined &&
					content !== undefined &&
					tags !== undefined &&
					isPublic !== undefined
				) {
					const updatedNote = {
						_id: ObjectId(noteId),
						title,
						content,
						tags,
						isPublic,
						editDate: new Date(),
					};

					try {
						// update database
						const updateResult = await get()
							.db.collection('notes')
							.updateOne({ _id: ObjectId(noteId) }, updatedNote);
						console.log(updateResult);

						// update local state
						const updatedNotesList = get().notes.map((note) =>
							note._id.toString() === noteId ? updatedNote : note
						);
						set({ notes: updatedNotesList }, false, 'realmStore/updatedNote');
					} catch (err) {
						console.error(err);
					}
				} else {
					throw new Error('Not provided required note fields');
				}
			},
		}),
		{ name: 'realmStore' }
	)
);

export default useRealmStore;
