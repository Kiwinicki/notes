import { useQuery } from '@tanstack/react-query';
import { useApp } from './useApp';

const getTags = async ({ db }) => {
	if (db) {
		try {
			return await db.collection('tags').find();
		} catch (err) {
			throw new Error(err);
		}
	} else {
		throw new Error('No database provided');
	}
};

export const useTags = () => {
	const [{ data: appData, isSuccess: appSuccess }] = useApp();

	const tagsDataAndStatus = useQuery(
		['tags', appData.user?.id],
		() => getTags({ db: appData.db }),
		{
			enabled: appSuccess && !!appData.db,
		}
	);

	const addTag = () => console.log('addTag');
	const deleteTag = () => console.log('deleteTag');

	return [tagsDataAndStatus, { addTag, deleteTag }];
};
