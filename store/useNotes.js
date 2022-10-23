import { useQuery, useMutation } from '@tanstack/react-query';
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

	const notesDataAndStatus = useQuery(
		['notes', appData.user?.id, { phrase, tag, noteId }],
		() => getNotes({ db: appData.db, phrase, tag, noteId }),
		{ enabled: appSuccess && !!appData.db }
	);

	const addNote = useMutation();
	const updateNote = useMutation(); // should cause refetch in useQuery or change cache
	const deleteNote = useMutation();

	return [notesDataAndStatus, { addNote, updateNote, deleteNote }];
};
