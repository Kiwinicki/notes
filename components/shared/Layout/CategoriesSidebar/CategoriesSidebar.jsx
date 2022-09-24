import styles from './CategoriesSidebar.module.scss';
import { Button } from '../../Button/Button';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';

export const CategoriesSidebar = () => {
	const userType = useRealmStore((state) => state.userType);
	const categories = useRealmStore((state) => state.categories);

	return (
		<aside className={styles.categories}>
			{categories &&
				categories.map((category, i) => (
					// TODO: filters notes by category onClick
					<Button key={i}>{category.name}</Button>
				))}
			{/* TODO: adding categories onClick */}
			{userType === userTypes.admin && <Button>Dodaj kategorię</Button>}
		</aside>
	);
};
