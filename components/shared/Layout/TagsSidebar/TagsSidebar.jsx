import { useState } from 'react';
import styles from './TagsSidebar.module.scss';
import { Button } from '../../Button/Button';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';
import { useToggle } from '../../../../hooks/useToggle';
import { useEffect } from 'react';

export const TagsSidebar = () => {
	const userType = useRealmStore((state) => state.userType);
	const tags = useRealmStore((state) => state.tags);
	const addTag = useRealmStore((state) => state.addTag);

	const [isAddingTagVisible, setIsAddingTagVisible] = useState(false);
	const [newTagName, setNewTagName] = useState('');
	const [isNewTagPublic, setIsNewTagPublic] = useToggle(false);

	return (
		<aside className={styles.tags}>
			{tags &&
				tags.length > 0 &&
				tags.map((tag, i) => (
					// TODO: filters notes by category onClick
					<Button key={i}>{tag.name}</Button>
				))}
			{/* TODO: adding categories onClick */}
			{userType === userTypes.admin &&
				(isAddingTagVisible ? (
					<div className={styles.addTagContainer}>
						<input
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
						{/* TODO: adding new tag to realm */}
						<button
							onClick={() =>
								addTag({ name: newTagName, isPublic: isNewTagPublic })
							}
						>
							+
						</button>
					</div>
				) : (
					<Button onClick={() => setIsAddingTagVisible(true)}>Dodaj tag</Button>
				))}
		</aside>
	);
};
