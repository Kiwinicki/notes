import styles from './TagsSidebar.module.scss';
import { useState, useCallback } from 'react';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import useRealmStore, { userTypes } from '../../../../hooks/useRealmStore';
import { useToggle } from '../../../../hooks/useToggle';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
// import { useTags } from '../../../../store/useTags';
import { Loader } from '../../Loader/Loader';
import { useApp } from '../../../../store/useApp';
import { useTags } from '../../../../store/useTags';

export const TagsSidebar = () => {
	const [
		{
			data: { userType },
		},
	] = useApp();
	const [{ data: tagsData, isLoading, isSuccess, isError }, { addTag }] =
		useTags();

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

	if (isLoading) {
		return (
			<aside className={styles.tags}>
				<Loader />
			</aside>
		);
	}

	if (isError) {
		<p>Wystąpił problem z pobieraniem tagów</p>;
	}

	if (isSuccess) {
		return (
			<aside className={styles.tags}>
				{tagsData.length > 0 &&
					tagsData.map((tag, i) => (
						<ButtonLink
							href={{
								pathname: '/',
								query: { tag: tag.name },
							}}
							key={i}
						>
							#{tag.name}
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
	}
};
