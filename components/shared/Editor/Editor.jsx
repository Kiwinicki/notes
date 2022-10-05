import { useState, useEffect } from 'react';
import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Alert } from '../Alert/Alert';
import { components } from '../../mdx/allComponents';
import useRealmStore from '../../../hooks/useRealmStore';
import { useToggle } from '../../../hooks/useToggle';
import useNoteStore, { errorTypes } from '../../../hooks/useNoteStore';

// TODO: adding images to note (convert to binary/base64 or something)

export const Editor = ({ saveHandler }) => {
	const tags = useRealmStore((state) => state.tags);

	const title = useNoteStore((state) => state.title);
	const content = useNoteStore((state) => state.content);
	const noteTags = useNoteStore((state) => state.noteTags);
	const isPublic = useNoteStore((state) => state.isPublic);
	const error = useNoteStore((state) => state.error);
	const setValues = useNoteStore((state) => state.setValues);

	const [serializedContent, setSerializedContent] = useState(null);
	const [isEditorOpen, toggleIsEditorOpen] = useToggle(true);
	const [isPreviewOpen, toggleIsPreviewOpen] = useToggle(true);

	useEffect(() => {
		(async () => {
			if (content) {
				const mdx = await serialize(content);
				setSerializedContent(mdx);
			}
		})();
	}, []);

	const handleInput = async (event) => {
		setValues({ content: event.target.value });
	};

	useEffect(() => {
		(async () => {
			try {
				const mdx = await serialize(content);
				setSerializedContent(mdx);
				setValues({ error: errorTypes.none });
			} catch (err) {
				console.error(err);
				setValues({ error: errorTypes.serialize });
			}
		})();
	}, [content]);

	// TODO: working validation
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

	return (
		<div className={styles.container}>
			<Header
				{...{
					saveHandler,
					isEditorOpen,
					toggleIsEditorOpen,
					isPreviewOpen,
					toggleIsPreviewOpen,
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
