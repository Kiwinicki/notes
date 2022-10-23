import styles from './TagsSidebar.module.scss';
import { useState, useCallback } from 'react';
import { Button, ButtonLink } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { useToggle } from '../../../../hooks/useToggle';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { Loader } from '../../Loader/Loader';
import { useApp, userTypes } from '../../../../store/useApp';
import { useTags } from '../../../../store/useTags';

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
					<CloseIcon />
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

const CloseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		stroke="currentColor"
		fill="currentColor"
		viewBox="0 0 16 16"
	>
		<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
	</svg>
);

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
