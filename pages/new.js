import React from 'react';
import Head from 'next/head';
import { Editor } from '../components/shared/Editor/Editor';
import { AnonymousRedirect } from '../components/shared/AnonymousRedirect';
import useNoteStore, { errorTypes } from '../hooks/useNoteStore';
import { useNotes } from '../store/useNotes';
import { useApp } from '../store/useApp';

export default function NewNotePage() {
	const [, { addNote }] = useNotes({});
	const [{ data }] = useApp({});
	const { title, content, noteTags, isPublic, setError } = useNoteStore();

	const saveHandler = async () => {
		if (data.db) {
			try {
				console.log({
					title,
					content,
					tags: noteTags,
					isPublic,
				});

				const insertedId = await addNote({
					title,
					content,
					tags: noteTags,
					isPublic,
				});
				console.log(insertedId);
			} catch (err) {
				setError(errorTypes.savingError);
			}
		}
	};

	return (
		<AnonymousRedirect>
			<Head>
				<title>Nowa notatka</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Editor saveHandler={saveHandler} />
		</AnonymousRedirect>
	);
}
