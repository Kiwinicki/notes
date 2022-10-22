import { useQuery } from '@tanstack/react-query';
import { useApp } from './useApp';

const getNotes = ({ db, phrase, tag }) => {
	return new Promise(async (resolve, reject) => {
		if (db) {
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

export const useNotes = ({ phrase = '', tag }) => {
	const [{ data: appData, isSuccess: appSuccess }] = useApp();

	return useQuery(
		['notes', appData.user?.id, { phrase, tag }],
		() => getNotes({ db: appData.db, phrase, tag }),
		{ enabled: appSuccess }
	);

	// const getSingleNote = useMutation(getSingleNoteHandler);
	// const addNote = useMutation(addNoteHandler);
	// const updateNote = useMutation(updateNoteHandler);
	// const deleteNote = useMutation(deleteNoteHandler);

	// return [ notesDataAndStatus, { addNote, updateNote, deleteNote, getSingleNote }];
};
