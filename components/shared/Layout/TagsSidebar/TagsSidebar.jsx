import styles from './TagsSidebar.module.scss';
import { useState, useCallback } from 'react';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { useToggle } from '../../../../hooks/useToggle';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { Loader } from '../../Loader/Loader';
import { useApp, userTypes } from '../../../../store/useApp';
import { useTags } from '../../../../store/useTags';
import { XIcon } from '../../../../assets/XIcon';

export const TagsSidebar = ({ isTagMenuOpen, toggleTagMenu }) => {
	const [{ data: tagsData, isLoading, isSuccess, isError }] = useTags();

	if (isLoading) {
		return (
			<aside className={styles.container}>
				<Loader />
			</aside>
		);
	}

	if (isError) {
		<aside className={styles.container}>
			<p>Wystąpił problem z pobieraniem tagów</p>;
		</aside>;
	}

	if (isSuccess) {
		return (
			<aside
				className={`${styles.container} ${
					isTagMenuOpen ? styles.containerOpen : ''
				}`}
			>
				<Button onClick={toggleTagMenu} className={styles.closeButton}>
					<XIcon />
					{/* TODO: AddTag here for better UX */}
				</Button>
				<div className={styles.scrollableContainer}>
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
					{/* TODO: move AddTag on top next to close button, becouse with big amount of tags button will be far down */}
					<AddTag />
				</div>
			</aside>
		);
	}
};

const AddTag = ({}) => {
	const [{ data }] = useApp();
	const [, { addTag }] = useTags();

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

	if (data.userType === userTypes.admin) {
		return (
			// TODO: add styles
			isAddingTagVisible ? (
				<div ref={ref} className={styles.addTag}>
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
			)
		);
	}
};
