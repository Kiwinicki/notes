import { useState, useEffect, useRef } from 'react';
import styles from './NotePage.module.scss';
import { useApp, userTypes } from '../../store/useApp';
import { useNotes } from '../../store/useNotes';
import { useRouter } from 'next/router';
import Editor from '@monaco-editor/react';
import { useDebounce } from 'use-debounce';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { components } from '../mdx';
import { ErrorBoundary } from 'react-error-boundary';
import remarkMath from 'remark-math';
import markdown from 'remark-parse';
import rehypeKatex from 'rehype-katex';
import { EditorNavBar } from '../shared/EditorNavBar/EditorNavBar';

export const Note = () => {
	const {
		query: { noteId },
	} = useRouter();

	const [
		{
			data: { userType },
		},
	] = useApp();

	const [{ data, isLoading, isSuccess, isError }] = useNotes({ noteId });

	const [editorValue, setEditorValue] = useState(
		data?.content || 'start typing...'
	);
	const [debouncedEditorValue] = useDebounce(editorValue, 300);
	const [serializedContent, setSerializedContent] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const serialized = await serialize(debouncedEditorValue, {
					mdxOptions: {
						remarkPlugins: [markdown, remarkMath],
						rehypePlugins: [rehypeKatex],
						format: 'mdx',
					},
					parseFrontmatter: false,
				});
				setSerializedContent(serialized);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [debouncedEditorValue]);

	return (
		<div className={styles.noteContainer}>
			<EditorNavBar />
			<div className={styles.contentContainer}>
				{userType === userTypes.admin && (
					<>
						<div>
							<Editor
								defaultLanguage="markdown"
								defaultValue={editorValue}
								value={editorValue}
								theme="vs-dark"
								className={styles.editor}
								options={{
									minimap: { enabled: false },
									wordWrap: 'on',
									automaticLayout: true,
								}}
								onChange={setEditorValue}
							/>
						</div>
						{/* TODO: resizing editor  */}
						<div className={styles.resizeBar} />
					</>
				)}
				<div className={styles.mdxOutput}>
					<div className={styles.scrollableOutput}>
						<p>{data?.title}</p>
						tagi:
						<ul>
							{data?.tags.map((tag) => (
								<li key={tag}>#{tag}</li>
							))}
						</ul>
						<ErrorBoundary>
							{serializedContent && (
								<MDXRemote {...serializedContent} components={components} />
							)}
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
};
