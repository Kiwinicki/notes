import styles from './Editor.module.scss';
import { Header } from './Header/Header';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useState } from 'react';

// TODO: shared object with all mdx components for whole application
import { code } from '../mdx/code';

export const Editor = () => {
	const [content, setContent] = useState('');
	const [serialized, setSerialized] = useState(null);

	const handleInput = async (event) => {
		setContent(event.target.value);
		const mdx = await serialize(event.target.value);
		setSerialized(mdx);
	};

	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<form className={styles.input}>
					<textarea
						name="content"
						className={styles.textarea}
						rows={30}
						cols={30}
						value={content}
						onInput={handleInput}
						placeholder="# Treść notatki"
					/>
				</form>
				<div className={styles.output}>
					{/* TODO: error boundary!!! */}
					{serialized && <MDXRemote {...serialized} components={{ code }} />}
				</div>
			</main>
		</div>
	);
};
