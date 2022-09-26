import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Layout } from '../../shared/Layout/Layout';
import { components } from '../../mdx/allComponents';

export const NoteForVisitor = (note) => {
	const [serialized, setSerialized] = useState(null);

	useEffect(() => {
		(async () => {
			const serializedContent = await serialize(note.content);
			setSerialized(serializedContent);
		})();
	}, [note.content]);

	console.log(note);

	return (
		<Layout>
			<section>
				<p>Tytuł: {note.title}</p>
				{serialized && <MDXRemote {...serialized} components={components} />}
			</section>
		</Layout>
	);
};
