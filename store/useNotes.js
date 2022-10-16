import { useQuery } from '@tanstack/react-query';
import { useDb } from './useDb';

export const useNotes = ({ phrase, tag }) => {
	const { data: db } = useDb({});

	// TODO: search index if phrase
	// TODO: search notes by tag if provided tag
	// TODO: bonus: if provided both tag and phrase then combine search
	// TODO: bouns: pagination

	return useQuery(
		['notes', { phrase, tag }],
		() => getNotes({ phrase, query }),
		{
			enabled: !!db,
		}
	);
};

const getNotes = ({ db, phrase, tag }) => {
	return new Promise((resolve, reject) => {
		if (db) {
			// get first notes on init render
			if (!phrase && !tag) {
				db.collection('notes')
					.find()
					.limit(20)
					.then((res) => resolve(res))
					.catch((err) => reject(err));
			}
			if (phrase) {
				db.collection('notes')
					.aggregate([
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
					])
					.then((res) => resolve(res))
					.catch((err) => reject(err));
			}
			if (tag) {
				db.collection('notes')
					.find({ tags: { $in: [tag] } })
					.then((res) => resolve(res))
					.catch((err) => reject(err));
			}
			if (phrase && tag) {
				// to be done later
			}
		} else {
			reject('Database not provided');
		}
	});
};
