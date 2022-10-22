import { useEffect, useState } from 'react';
import styles from './NoteForVisitor.module.scss';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Layout } from '../../shared/Layout/Layout';
import { components } from '../../mdx';
import { ButtonLink } from '../../shared/Button/Button';

export const NoteForVisitor = ({ title, content, tags: noteTags }) => {
	const [serialized, setSerialized] = useState(null);

	useEffect(() => {
		if (content) {
			(async () => {
				const serializedContent = await serialize(content);
				setSerialized(serializedContent);
			})();
		}
	}, [content]);

	return (
		<Layout>
			<article className={styles.note}>
				<p className={styles.title}>{title}</p>
				<p className={styles.tags}>
					<span>tagi:</span>
					{noteTags &&
						noteTags.map((tagName, i) => (
							<ButtonLink key={i}>#{tagName}</ButtonLink>
						))}
				</p>
				{serialized && <MDXRemote {...serialized} components={components} />}
			</article>
		</Layout>
	);
};
