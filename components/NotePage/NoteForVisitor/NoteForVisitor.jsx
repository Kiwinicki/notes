import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Layout } from '../../shared/Layout/Layout';
import { components } from '../../mdx/allComponents';
import useNoteStore from '../../../hooks/useNoteStore';

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
			<section>
				<p>Tytuł: {title}</p>
				<p>
					tagi:
					{noteTags.map((tagName, i) => (
						<span key={i}> #{tagName}</span>
					))}
				</p>
				{serialized && <MDXRemote {...serialized} components={components} />}
			</section>
		</Layout>
	);
};
