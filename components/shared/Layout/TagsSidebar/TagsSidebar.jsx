import styles from './TagsSidebar.module.scss';
import { Button } from '../../Button/Button';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';

export const TagsSidebar = () => {
	const userType = useRealmStore((state) => state.userType);
	const tags = useRealmStore((state) => state.tags);

	return (
		<aside className={styles.tags}>
			{tags &&
				tags.length > 0 &&
				tags.map((tag, i) => (
					// TODO: filters notes by category onClick
					<Button key={i}>{tag.name}</Button>
				))}
			{/* TODO: adding categories onClick */}
			{userType === userTypes.admin && <Button>Dodaj tag</Button>}
		</aside>
	);
};
