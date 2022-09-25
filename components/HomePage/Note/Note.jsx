import { useState, useEffect } from 'react';
import styles from './Note.module.scss';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { components } from '../../mdx/allComponents';
import Link from 'next/link';

export const Note = ({ title, content, categoryName, _id }) => {
	const [serializedContent, setSerializedContent] = useState(null);

	useEffect(() => {
		serialize(content).then((x) => setSerializedContent(x));
	}, [content]);

	return (
		<Link href={`/note/${_id.toString()}`}>
			<div className={styles.note}>
				<h2 className={styles.title}>{title}</h2>
				<article className={styles.content}>
					{serializedContent && (
						<MDXRemote {...serializedContent} components={components} />
					)}
				</article>
				<div className={styles.bottom}>
					{/* TODO: filter by category onClick? */}
					<span className={styles.categoryLabel}>{categoryName}</span>
					{/* TODO: remove note onClick */}
					<button className={styles.removeButton}>
						<TrashIcon />
					</button>
				</div>
			</div>
		</Link>
	);
};

const TrashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={2}
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
		/>
	</svg>
);
