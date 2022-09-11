import { MDXRemote } from 'next-mdx-remote';
import styles from './Note.module.scss';
import { useState, useEffect } from 'react';
import useRealmStore from '../../../hooks/useRealmStore';

// components for MDX
import { code } from '../../mdx/code';
import { Button } from '../../shared/Button/Button'; // TODO: remove, only components from components/mdx directory

export const Note = ({ title, content, categoryId }) => {
	const db = useRealmStore(({ db }) => db);
	const [categoryObj, setCategoryObj] = useState({});

	useEffect(() => {
		if (db) {
			(async () => {
				db.collection('categories')
					.findOne({ _id: categoryId })
					.then((res) => setCategoryObj(res))
					.catch((err) => console.error(err));
			})();
		}
	}, [db]);

	const components = { code, Button };

	return (
		<div className={styles.note}>
			<h2 className={styles.noteTitle}>{title}</h2>
			<article className={styles.noteContent}>
				<MDXRemote {...content} components={components} />
			</article>
			<div>
				{/* TODO: filter by category onClick? */}
				{categoryObj?.name ? (
					<span className={styles.categoryLabel}>{categoryObj.name}</span>
				) : (
					<span className={styles.categoryLabel}>...</span>
				)}
			</div>
		</div>
	);
};
