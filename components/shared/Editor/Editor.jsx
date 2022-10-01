import { useState, useEffect } from 'react';
import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Alert } from '..//Alert/Alert';
import { components } from '../../mdx/allComponents';
import useRealmStore from '../../../hooks/useRealmStore';
import { useToggle } from '../../../hooks/useToggle';

export const errorTypes = {
	none: false,
	serialize: 'Problem z MDX',
	tag: 'Ustawiono notatkę jako publiczną i dodano prywatny tag',
	emptyTitle: 'Brak tytułu notatki',
	savingError: 'Błąd podczas zapisywania notatki',
	emptyTag: 'Nie dodano żadnego tagu',
};

// TODO: adding images to note (convert to binary/base64 or something)

export const Editor = ({
	saveHandler,
	content: initContent = '',
	title: initTitle = '',
	tags: initNoteTags = [],
	isPublic: initIsPublic = false,
}) => {
	const tags = useRealmStore((state) => state.tags);

	const [error, setError] = useState(errorTypes.none);
	const [content, setContent] = useState(initContent);
	const [title, setTitle] = useState(initTitle);
	const [noteTags, setNoteTags] = useState(initNoteTags);
	const [isPublic, toggleIsPublic] = useToggle(initIsPublic);

	const [serializedContent, setSerializedContent] = useState(null);

	const [isEditorOpen, toggleIsEditorOpen] = useToggle(true);
	const [isPreviewOpen, toggleIsPreviewOpen] = useToggle(true);

	useEffect(() => {
		console.log('init public', initIsPublic);
	}, [initIsPublic]);
	console.log('public', isPublic);

	useEffect(() => {
		setNoteTags(initNoteTags);
	}, [initNoteTags]);

	useEffect(() => {
		(async () => {
			if (content) {
				const mdx = await serialize(content);
				setSerializedContent(mdx);
			}
		})();
	}, []);

	const handleInput = async (event) => {
		setContent(event.target.value);
		try {
			const mdx = await serialize(event.target.value);
			setSerializedContent(mdx);
			setError(errorTypes.none);
		} catch (err) {
			console.error(err);
			setError(errorTypes.serialize);
		}
	};

	const validate = async () => {
		console.log('validation');
		const isAllTagsPublic = noteTags.every((tagName) => {
			const tagObj = tags.find((tag) => tag.name === tagName);
			return tagObj.isPublic;
		});
		switch (true) {
			// TODO: if some tag is private and note is set to public
			case isPublic && !isAllTagsPublic:
				setError(errorTypes.category);
				break;
			case noteTags.length == 0:
				setError(errorTypes.emptyTag);
				break;
			case title === '':
				setError(errorTypes.emptyTitle);
				break;
			default:
				setError(errorTypes.none);
				break;
		}
	};

	const checkBeforeSubmit = (ev, saveHandler) => {
		ev.preventDefault();
		validate();
		if (!error) {
			try {
				saveHandler({ title, content, tags: noteTags, isPublic });
			} catch (error) {
				setError(errorTypes.savingError);
			}
		}
	};

	return (
		<div className={styles.container}>
			<Header
				{...{
					saveHandler: (ev) => checkBeforeSubmit(ev, saveHandler),
					validate,
					error,
					isEditorOpen,
					toggleIsEditorOpen,
					isPreviewOpen,
					toggleIsPreviewOpen,
					title,
					setTitle,
					noteTags,
					setNoteTags,
					isPublic,
					toggleIsPublic,
				}}
			/>
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
