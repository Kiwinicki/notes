import styles from './Header.module.scss';
import { Button } from '../../shared/Button/Button';
import useRealmStore from '../../../hooks/useRealmStore';

export const Header = () => {
	const categories = useRealmStore((state) => state.categories);

	return (
		<header className={styles.container}>
			<nav className={styles.nav}>
				<div>
					{/* TODO: toggling editor and view mode */}
					<label>
						edytor
						<input type="checkbox" name="editor" id="" />
					</label>
					<label>
						podgląd
						<input type="checkbox" name="view" id="" />
					</label>
				</div>
				{/* TODO: note title */}
				<label htmlFor="">
					Tytuł notatki
					<input type="text" name="title" id="title" />
				</label>
				{/* TODO: public/private note */}
				<div>
					<label>
						publiczna
						<input type="radio" name="isPublic" id="isPrivate" value={false} />
					</label>
					<label>
						prywatna
						<input type="radio" name="isPublic" id="isPublic" value={true} />
					</label>
				</div>
				{/* TODO: note category */}
				<select name="category" id="">
					{categories &&
						categories.map((cat) => (
							<option value={cat.slugName} key={cat.slugName}>
								{cat.name} ({cat.public ? 'publiczna' : 'prywatna'})
							</option>
						))}
				</select>
				<Button>Zapisz</Button>
			</nav>
		</header>
	);
};
