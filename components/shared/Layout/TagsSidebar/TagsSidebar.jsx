import styles from './TagsSidebar.module.scss';
import { useState, useCallback } from 'react';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';
import { useToggle } from '../../../../hooks/useToggle';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';

export const TagsSidebar = () => {
	const userType = useRealmStore((state) => state.userType);
	const tags = useRealmStore((state) => state.tags);
	const addTag = useRealmStore((state) => state.addTag);

	const [newTagName, setNewTagName] = useState('');
	const [isNewTagPublic, setIsNewTagPublic] = useToggle(false);

	const {
		ref,
		state: isAddingTagVisible,
		setState: setIsAddingTagVisible,
	} = useOutsideClick();

	const outsideClickHandler = useCallback(() => {
		setIsAddingTagVisible((prev) => !prev);
		setNewTagName('');
	}, []);

	return (
		<aside className={styles.tags}>
			{tags &&
				tags.length > 0 &&
				tags.map((tag, i) => (
					// TODO: filters notes by category onClick
					<ButtonLink
						href={{
							pathname: '/',
							query: { tag: tag.name },
						}}
						key={i}
					>
						{tag.name}
					</ButtonLink>
				))}
			{userType === userTypes.admin &&
				// TODO: add styles
				(isAddingTagVisible ? (
					<div ref={ref} className={styles.addTagContainer}>
						<Input
							type="text"
							value={newTagName}
							onChange={(ev) => setNewTagName(ev.target.value)}
							className={styles.tagName}
						/>
						<label>
							publiczny
							<input
								type="checkbox"
								value={isNewTagPublic}
								onChange={setIsNewTagPublic}
								className={styles.tagPublic}
							/>
						</label>
						<button
							onClick={() =>
								addTag({ name: newTagName, isPublic: isNewTagPublic })
							}
						>
							+
						</button>
					</div>
				) : (
					<Button onClick={outsideClickHandler}>Dodaj tag</Button>
				))}
		</aside>
	);
};
