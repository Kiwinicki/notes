import { useState, useEffect } from 'react';
import styles from './MDXOutput.module.scss';
import { MDXRemote } from 'next-mdx-remote';
import { components } from '../../../mdx';
import { ErrorBoundary } from 'react-error-boundary';
import { serialize } from 'next-mdx-remote/serialize';
import { useDebounce } from 'use-debounce';
import remarkMath from 'remark-math';
import markdown from 'remark-parse';
import rehypeKatex from 'rehype-katex';
import useNoteStore from '../../../../store/useNoteStore';

export const MDXOutput = () => {
	const { content, title, tags } = useNoteStore();
	const [debouncedContent] = useDebounce(content, 300);
	const renderedMDX = useRenderMDX(debouncedContent);

	return (
		<div className={styles.mdxOutput}>
			<div className={styles.scrollableOutput}>
				<div>Tytuł: {title}</div>

				<div>
					tagi:
					<ul>
						{tags.map((tag) => (
							<li key={tag}>#{tag}</li>
						))}
					</ul>
				</div>

				<ErrorBoundary FallbackComponent={MDXErrorFallback}>
					{renderedMDX && (
						<MDXRemote {...renderedMDX} components={components} />
					)}
				</ErrorBoundary>
			</div>
		</div>
	);
};

const MDXErrorFallback = ({ error, resetErrorBoundary }) => {
	return (
		<>
			<p>
				Błąd przy renderowaniu zawartości. Szczegóły: {JSON.stringify(error)}
			</p>
			<button onClick={resetErrorBoundary}>Odśwież</button>
		</>
	);
};

const useRenderMDX = (content) => {
	const [renderedContent, setRenderedContent] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const serialized = await serialize(content, {
					mdxOptions: {
						remarkPlugins: [markdown, remarkMath],
						rehypePlugins: [rehypeKatex],
						format: 'mdx',
					},
					parseFrontmatter: false,
				});
				setRenderedContent(serialized);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [content]);

	return renderedContent;
};
