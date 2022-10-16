import { useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';

export const useDb = () => {
	const { data } = useUser({});

	return useQuery(
		['db', data?.user.id],
		() => {
			const realmService = data?.user.mongoClient('mongodb-atlas');
			return realmService.db('second-brain');
		},
		{
			enabled: !!data?.user.id,
		}
	);
};
