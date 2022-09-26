import { useEffect } from 'react';
import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Alert } from '..//Alert/Alert';
import { components } from '../../mdx/allComponents';
import useRealmStore from '../../../hooks/useRealmStore';
import useEditorStore, { errorTypes } from './useEditorStore';

// TODO: adding images to note (convert to binary/base64 or something)

export const Editor = ({
	title: initTitle = '',
	content: initContent = '',
	serializedContent: initSerializedContent = '',
	categoryName: initCategoryName = '',
	public: initIsPublic = false,
}) => {
	const db = useRealmStore((state) => state.db);
	const categories = useRealmStore((state) => state.categories);

	console.log('initPUblic', initIsPublic);

	const {
		title,
		content,
		serializedContent,
		categoryName,
		isPublic,
		setValues,
		setError,
		error,
		isEditorOpen,
		isPreviewOpen,
	} = useEditorStore();

	useEffect(() => {
		setValues({
			title: initTitle,
			content: initContent,
			categoryName: initCategoryName,
			isPublic: initIsPublic,
			serializedContent: initSerializedContent,
		});
	}, [
		initTitle,
		initContent,
		initCategoryName,
		initIsPublic,
		initSerializedContent,
	]);

	const handleInput = async (event) => {
		setValues({ content: event.target.value });
		try {
			const mdx = await serialize(event.target.value);
			setValues({ serializedContent: mdx });
			setError(errorTypes.none);
		} catch (e) {
			setError(errorTypes.serialize);
		}
	};

	const validate = async () => {
		const categoryObj = categories.find((cat) => cat.name === categoryName);
		console.log('validate', isPublic);
		if (isPublic && !categoryObj.public) {
			setError(errorTypes.category);
			return;
		}
		if (title === '') {
			setError(errorTypes.emptyTitle);
			return;
		}
		await setError(errorTypes.none);
	};

	const saveHandler = async () => {
		validate();
		if (noteError === errorTypes.none) {
			try {
				const insertedId = await db.collection('notes').insertOne({
					public: isPublic,
					title,
					content,
					categoryName,
					editDate: new Date(),
				});
				console.log(insertedId);
			} catch (error) {
				setError(errorTypes.savingError);
			}
		}
	};

	return (
		<div className={styles.container}>
			<Header saveHandler={saveHandler} validate={validate} />
			<main className={styles.main}>
				<div
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
				</div>
				<div
					className={`${styles.output} ${!isPreviewOpen ? styles.closed : ''}`}
				>
					{error && <Alert>{error}</Alert>}
					<div className={styles.renderedOutput}>
						{serializedContent && (
							<MDXRemote {...serializedContent} components={components} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
};
