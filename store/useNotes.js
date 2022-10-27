import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from './useApp';
import { BSON } from 'realm-web';

const { ObjectId } = BSON;

const getNotes = ({ db, phrase, tag, noteId }) => {
	return new Promise(async (resolve, reject) => {
		if (db) {
			// TODO: search note in general cache?
			if (noteId) {
				try {
					const note = db
						.collection('notes')
						.findOne({ _id: ObjectId(noteId) });
					if (note) resolve(note);
					else reject('Note not found');
				} catch (err) {
					reject(err);
				}
			}

			if (phrase) {
				try {
					const noteData = await db.collection('notes').aggregate([
						{
							$search: {
								index: 'searchNote',
								text: {
									query: phrase,
									path: {
										wildcard: '*',
									},
									fuzzy: {
										maxEdits: 1,
										maxExpansions: 1,
									},
								},
							},
						},
						{
							$limit: 10,
						},
					]);
					resolve(noteData);
				} catch (err) {
					reject(err);
				}
			}

			if (tag) {
				try {
					const noteData = await db
						.collection('notes')
						.find({ tags: { $in: [tag] } });
					resolve(noteData);
				} catch (err) {
					reject(err);
				}
			}

			// get initial notes for home page
			if (!tag && !phrase) {
				try {
					const noteData = await db
						.collection('notes')
						.find({}, { $limit: 10 });
					resolve(noteData);
				} catch (err) {
					reject(err);
				}
			}
		} else {
			reject('No database provided');
		}
	});
};

export const useNotes = ({ phrase = '', tag, noteId }) => {
	const [{ data: appData, isSuccess: appSuccess }] = useApp();
	const queryClient = useQueryClient();

	const notesDataAndStatus = useQuery(
		['notes', appData.user?.id, { phrase, tag, noteId }],
		() => getNotes({ db: appData.db, phrase, tag, noteId }),
		{ enabled: appSuccess && !!appData.db }
	);

	const addNote = useMutation(
		async ({ title, content, tags, isPublic }) => {
			const resp = await addNoteHandler({
				title,
				content,
				tags,
				isPublic,
				db: appData.db,
			});
			console.log(resp);
			return resp;
		},
		{
			onSuccess: () =>
				// TODO: modify cache for better performance (don't have to fetch data again)
				queryClient.invalidateQueries(['notes', appData.user?.id], { phrase }),
		}
	);
	const updateNote = useMutation(
		async ({ title, content, tags, isPublic }) => {
			const resp = await updateNoteHandler({
				noteId,
				title,
				content,
				tags,
				isPublic,
				db: appData.db,
			});
			console.log(resp);
			return resp;
		},
		{
			onSuccess: () =>
				queryClient.invalidateQueries(['notes', appData.user?.id], { phrase }),
		}
	);
	const deleteNote = useMutation(
		async ({ noteId }) => {
			const resp = await deleteNoteHandler({ noteId, db: appData.db });
			console.log(resp);
			return resp;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['notes', appData.user?.id], { phrase });
				// TODO: modify cache for better performance (don't have to fetch data again)
				// queryClient.setQueryData(['notes', appData.user?.id], {phrase})
			},
		}
	);

	return [notesDataAndStatus, { addNote, updateNote, deleteNote }];
};

// working right
const addNoteHandler = ({ title, content, tags, isPublic, db }) => {
	if (
		title !== undefined &&
		content !== undefined &&
		tags !== undefined &&
		isPublic !== undefined
	) {
		return new Promise((resolve, reject) => {
			const newNote = {
				title,
				content,
				tags,
				isPublic,
				editDate: new Date(),
			};
			if (db) {
				try {
					db.collection('notes')
						.insertOne(newNote)
						.then((res) => resolve(res));
				} catch (err) {
					throw new Error(err);
				}
			} else {
				throw new Error('No database provided');
			}
		});
	}
};

// working right
const updateNoteHandler = ({ db, noteId, title, content, tags, isPublic }) => {
	return new Promise((resolve, reject) => {
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
				db.collection('notes')
					.updateOne({ _id: ObjectId(noteId) }, updatedNote)
					.then((res) => {
						console.log(res);
						resolve(res);
					});
			} catch (err) {
				reject(err);
			}
		} else {
			throw new Error('Not provided required note fields');
		}
	});
};

// working right
const deleteNoteHandler = ({ noteId, db }) => {
	return new Promise((resolve, reject) => {
		if (db) {
			if (noteId && typeof noteId === 'string') {
				try {
					db.collection('notes')
						.deleteOne({ _id: ObjectId(noteId) })
						.then((resp) => resolve(resp));
				} catch (err) {
					reject(err);
				}
			} else {
				reject('noteId with the type of string is required');
			}
		} else {
			reject('No database provided');
		}
	});
};
