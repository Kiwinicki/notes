import { useState, useEffect } from 'react';
import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Alert } from '../Alert/Alert';
import { components } from '../../mdx/';
import useRealmStore from '../../../hooks/useRealmStore';
import { useToggle } from '../../../hooks/useToggle';
import useNoteStore, {
	errorTypes,
	errorDescriptions,
} from '../../../hooks/useNoteStore';
import { ErrorBoundary } from 'react-error-boundary';

// TODO: adding images to note (convert to binary/base64 or something)

export const Editor = ({ saveHandler }) => {
	const tags = useRealmStore((state) => state.tags);

	const title = useNoteStore((state) => state.title);
	const content = useNoteStore((state) => state.content);
	const noteTags = useNoteStore((state) => state.noteTags);
	const isPublic = useNoteStore((state) => state.isPublic);
	const errors = useNoteStore((state) => state.errors);
	const setValues = useNoteStore((state) => state.setValues);
	const setError = useNoteStore((state) => state.setError);

	const [serializedContent, setSerializedContent] = useState(null);
	const [isEditorOpen, toggleIsEditorOpen] = useToggle(true);
	const [isPreviewOpen, toggleIsPreviewOpen] = useToggle(true);

	useEffect(() => {
		(async () => {
			if (content) {
				try {
					const mdx = await serialize(content);
					setSerializedContent(mdx);
					setError({ [errorTypes.serialize]: false });
				} catch (err) {
					console.error(err);
					setError({ [errorTypes.serialize]: true });
				}
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const mdx = await serialize(content);
				setSerializedContent(mdx);
				setError({ [errorTypes.serialize]: false });
			} catch (err) {
				console.error(err);
				setError({ [errorTypes.serialize]: true });
			}
		})();
	}, [content]);

	useEffect(() => {
		// TODO: debounce/throttle validation trigger
		const validate = async () => {
			const isAllTagsPublic = noteTags.every((tagName) => {
				const tagObj = tags.find((tag) => tag.name === tagName);
				return tagObj.isPublic;
			});

			if (isPublic && !isAllTagsPublic) {
				setError({ [errorTypes.publicNoteWithPrivateTag]: true });
			} else {
				setError({ [errorTypes.publicNoteWithPrivateTag]: false });
			}

			if (noteTags.length === 0) {
				setError({ [errorTypes.emptyTag]: true });
			} else {
				setError({ [errorTypes.emptyTag]: false });
			}

			if (title === '') {
				setError({ [errorTypes.emptyTitle]: true });
			} else {
				setError({ [errorTypes.emptyTitle]: false });
			}
		};
		validate();
	}, [title, content, isPublic, noteTags]);

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
						onInput={(ev) => {
							setValues({ content: ev.target.value });
						}}
						placeholder="# Treść notatki"
					/>
				</div>
				<div
					className={`${styles.output} ${!isPreviewOpen ? styles.closed : ''}`}
				>
					{Object.entries(errors)
						.filter(([key, val]) => val)
						.map(([errKey, errVal], i) => (
							<Alert key={i}>{errorDescriptions[errKey]}</Alert>
						))}
					{Object.entries(errors).some(([key, val]) => val)}
					<div className={styles.renderedOutput}>
						<ErrorBoundary FallbackComponent={MDXErrorFallback}>
							{serializedContent && (
								<MDXRemote {...serializedContent} components={components} />
							)}
						</ErrorBoundary>
					</div>
				</div>
			</main>
		</div>
	);
};

const MDXErrorFallback = ({ error, resetErrorBoundary }) => {
	return (
		<>
			<p>Coś się zepsuło. Szczegóły: {JSON.stringify(error)}</p>
			<button onClick={resetErrorBoundary}>Odśwież</button>
		</>
	);
};
