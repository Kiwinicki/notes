import create from 'zustand';
import { devtools } from 'zustand/middleware';
import * as RealmWeb from 'realm-web';

const { ObjectId } = RealmWeb.BSON;

export const userTypes = Object.freeze({
	visitor: 'visitor',
	admin: 'admin',
	none: 'none',
});

export const loginStatus = Object.freeze({
	loggedIn: 'loggedIn',
	loading: 'loading',
	unauthenticated: 'unauthenticated',
});

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
const app = new RealmWeb.App({ id: REALM_APP_ID });

const useRealmStore = create(
	devtools((set, get) => ({
		// app,
		// user: null,
		// userStatus: loginStatus.unauthenticated,
		// userType: userTypes.none,
		// db: null,
		// notes: null,
		// tags: null,
		// logIn: async ({ login, password }) => {
		// 	set({ userStatus: loginStatus.loading }, false, 'realmStore/logIn');
		// 	const withLoginAndPasswd = login && password;
		// 	let credentials = withLoginAndPasswd
		// 		? RealmWeb.Credentials.emailPassword(login, password)
		// 		: RealmWeb.Credentials.function();
		// 	try {
		// 		const user = await app.logIn(credentials);
		// 		set(
		// 			{
		// 				user: app.currentUser,
		// 				userType: withLoginAndPasswd ? userTypes.admin : userTypes.visitor,
		// 				userStatus: loginStatus.loggedIn,
		// 			},
		// 			false,
		// 			'realmStore/logIn'
		// 		);
		// 	} catch (err) {
		// 		console.error('Failed to log in', err);
		// 		set(
		// 			{
		// 				user: null,
		// 				userType: withLoginAndPasswd ? userTypes.visitor : userTypes.none,
		// 				userStatus: loginStatus.unauthenticated,
		// 			},
		// 			false,
		// 			'realmStore/logIn'
		// 		);
		// 	}
		// },
		// logOut: () => {
		// 	if (get().user !== null) {
		// 		get().user.logOut();
		// 		set(
		// 			{
		// 				user: null,
		// 				userType: userTypes.none,
		// 				userStatus: loginStatus.unauthenticated,
		// 			},
		// 			false,
		// 			'realmStore/logOut'
		// 		);
		// 	}
		// },
		// initDb: () => {
		// 	if (get().user !== null) {
		// 		const realmService = get().user.mongoClient('mongodb-atlas');
		// 		set(
		// 			{ db: realmService.db('second-brain') },
		// 			false,
		// 			'realmStore/initDb'
		// 		);
		// 	} else {
		// 		console.error("Couldn't initialize database without user logged in");
		// 	}
		// },
		// getInitData: async () => {
		// 	try {
		// 		if (get().user) {
		// 			const { notes, tags } = await get().user.functions.getInitData();
		// 			set({ notes, tags }, false, 'realmStore/getInitData');
		// 		}
		// 	} catch (err) {
		// 		console.error(err);
		// 	}
		// },
		// switchUser: async (loginInfo) => {
		// 	try {
		// 		const resp = await get().logIn(loginInfo);
		// 		get().app.switchUser(app.currentUser);
		// 		get().initDb();
		// 		get().getInitData();
		// 		return resp;
		// 	} catch (err) {
		// 		console.error(err);
		// 	}
		// },
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
						const { insertedId } = await get()
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
		deleteNote: async (noteId) => {
			if (get().db && noteId && typeof noteId === 'string') {
				try {
					const deleteResult = await get()
						.db.collection('notes')
						.deleteOne({ _id: ObjectId(noteId) });
					set(
						(state) => ({
							notes: state.notes.filter(
								(note) => note._id !== ObjectId(noteId)
							),
						}),
						false,
						'realmStore/deleteNote'
					);
					return deleteResult;
				} catch (err) {
					console.error(err);
				}
			}
		},
		addTag: async ({ name, isPublic }) => {
			if (typeof name === 'string' && typeof isPublic === 'boolean') {
				console.log(isPublic);
				if (get().db) {
					try {
						const insertedId = await get()
							.db.collection('tags')
							.insertOne({ name, isPublic });
						set(
							(state) => ({
								tags: [...state.tags, { name, isPublic, _id: insertedId }],
							}),
							false,
							'realmStore/addTag'
						);
						return insertedId;
					} catch (err) {
						console.error(err);
					}
				} else {
					throw new Error(
						'Not provided required tag fields (or fields with wrong types)'
					);
				}
			}
		},
		searchNoteById: async (noteId) => {
			let id = noteId;
			if (typeof noteId === 'string') id = ObjectId(noteId);
			const notes = get().notes;
			const noteFromStore =
				notes && get().notes.find((note) => note._id === id);
			if (!noteFromStore) {
				const db = await get().db;
				const noteFromDB =
					db && (await get().db.collection('notes').findOne({ _id: id }));
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
	})),
	{ name: 'realmStore' }
);

export default useRealmStore;
