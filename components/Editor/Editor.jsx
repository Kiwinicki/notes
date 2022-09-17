import { useState } from 'react';
import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Alert } from '../shared/Alert/Alert';
import useRealmStore from '../../hooks/useRealmStore';
import { components } from '../mdx/allComponents';
import { useToggle } from '../../hooks/useToggle';

const errorTypes = {
	none: false,
	serialize: 'Problem z MDX',
	category: 'Ustawiono notatkę jako publiczną i wybrano prywatną kategorię',
	emptyTitle: 'Brak tytułu notatki',
};

// TODO: adding images to note (convert to binary/base64 or something)

export const Editor = () => {
	const db = useRealmStore((state) => state.db);
	const categories = useRealmStore((state) => state.categories);

	const [content, setContent] = useState('');
	const [serialized, setSerialized] = useState(null);
	const [noteError, setNoteError] = useState(errorTypes.none);
	const [isSaveError, setIsSaveError] = useState(false);
	const [isEditorOpen, setIsEditorOpen] = useToggle(true);
	const [isPreviewOpen, setIsPreviewOpen] = useToggle(true);

	const handleInput = async (event) => {
		setContent(event.target.value);
		try {
			const mdx = await serialize(event.target.value);
			setSerialized(mdx);
			setNoteError(errorTypes.none);
		} catch (e) {
			setNoteError(errorTypes.serialize);
		}
	};

	const validate = ({ isPublic, categoryName }) => {
		const categoryObj = categories.find((cat) => cat.name === categoryName);
		console.log('validate', categories, categoryObj);
		console.log(categoryObj, categories);
		if (isPublic && !categoryObj.public) {
			setNoteError(errorTypes.category);
			return;
		}
		setNoteError(errorTypes.none);
	};

	const saveHandler = async ({ title, isPublic, categoryName }) => {
		if (title === '') {
			setNoteError(errorTypes.emptyTitle);
			return;
		}
		if (noteError === errorTypes.none) {
			try {
				const insertedId = await db.collection('notes').insertOne({
					public: isPublic,
					title,
					content,
					categoryName,
				});
				console.log(insertedId);
			} catch (error) {
				setIsSaveError(true);
			}
		} else {
			setIsSaveError(true);
		}
	};

	return (
		<div className={styles.container}>
			<Header
				saveHandler={saveHandler}
				noteError={noteError}
				isSaveError={isSaveError}
				validate={validate}
				{...{ isEditorOpen, setIsEditorOpen, isPreviewOpen, setIsPreviewOpen }}
			/>
			<main className={styles.main}>
				<form
					className={`${styles.input} ${!isEditorOpen ? styles.closed : ''}`}
				>
					<textarea
						name="content"
						className={styles.textarea}
						rows={30}
						cols={30}
						value={content}
						onInput={handleInput}
						placeholder="# Treść notatki"
					/>
				</form>
				<div
					className={`${styles.output} ${!isPreviewOpen ? styles.closed : ''}`}
				>
					{noteError && <Alert>{noteError}</Alert>}
					<div className={styles.renderedOutput}>
						{serialized && (
							<MDXRemote {...serialized} components={components} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
};
