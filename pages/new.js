import React from 'react';
import Head from 'next/head';
import { Editor } from '../components/shared/Editor/Editor';
import { AnonymousRedirect } from '../components/shared/AnonymousRedirect';
import { useNotes } from '../store/useNotes';
import { useApp } from '../store/useApp';
import useNoteStore from '../store/useNoteStore';
import { Layout } from '../components/shared/Layout/Layout';

export default function NewNotePage() {
	const [{ data }] = useApp({});
	const [, { addNote }] = useNotes({});

	const { errors, ...noteData } = useNoteStore();
	const saveHandler = async () => {
		const isAnyError = Object.values(errors).some((err) => err);
		if (data.db && !isAnyError) {
			try {
				console.log(noteData);

				const insertedId = await addNote.mutate(noteData);
				console.log(insertedId);
			} catch (err) {
				console.error(err);
				// TODO: handle saving error
				// setError(errorTypes.savingError);
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
			<Layout>
				<Editor saveHandler={saveHandler} />
			</Layout>
		</AnonymousRedirect>
	);
}
