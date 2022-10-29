import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
	const queryClient = useQueryClient();

	const tagsDataAndStatus = useQuery(
		['tags', appData.user?.id],
		() => getTags({ db: appData.db }),
		{
			enabled: appSuccess && !!appData.db,
		}
	);

	const addTag = useMutation(
		async ({ name, isPublic }) => {
			const resp = await addTagHandler({ db: appData.db, name, isPublic });
			console.log(resp);
			return resp;
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['tags']);
			},
		}
	);

	const deleteTag = useMutation(async ({ noteId }) => {
		const resp = await deleteTagHandler({ user: appData.user, noteId });
		console.log(resp);
		return resp;
	});

	return [tagsDataAndStatus, { addTag, deleteTag }];
};

const addTagHandler = async ({ db, name, isPublic }) => {
	if (typeof name === 'string' && typeof isPublic === 'boolean') {
		if (db) {
			try {
				return await db.collection('tags').insertOne({ name, isPublic });
			} catch (err) {
				throw new Error(err);
			}
		} else {
			throw new Error('No database provided');
		}
	} else {
		throw new Error(
			'Not provided required tag fields (or fields with wrong types)'
		);
	}
};

const deleteTagHandler = async ({ user, tagId }) => {
	return await user.functions.deleteTag(tagId);
};
