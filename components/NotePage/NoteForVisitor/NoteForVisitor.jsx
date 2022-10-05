import { useEffect, useState } from 'react';
import styles from './NoteForVisitor.module.scss';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Layout } from '../../shared/Layout/Layout';
import { components } from '../../mdx/allComponents';
import useNoteStore from '../../../hooks/useNoteStore';
import { ButtonLink } from '../../shared/Button/Button';

export const NoteForVisitor = () => {
	const { title, content, noteTags } = useNoteStore();

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
			<main className={styles.main}>
				<p className={styles.title}>{title}</p>
				<p className={styles.tags}>
					tagi:
					{noteTags &&
						noteTags.map((tagName, i) => (
							<ButtonLink key={i}>#{tagName}</ButtonLink>
						))}
				</p>
				{serialized && <MDXRemote {...serialized} components={components} />}
			</main>
		</Layout>
	);
};
