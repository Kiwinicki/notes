import React from 'react';
import Router from 'next/router';
import useNoteStore, { errorTypes } from '../../../hooks/useNoteStore';
import useRealmStore from '../../../hooks/useRealmStore';
import { Editor } from '../../shared/Editor/Editor';

export const NoteForAdmin = () => {
	const { db, updateNote } = useRealmStore(({ db, updateNote }) => ({
		db,
		updateNote,
	}));

	const noteId = useNoteStore((state) => state.noteId);
	const title = useNoteStore((state) => state.title);
	const content = useNoteStore((state) => state.content);
	const noteTags = useNoteStore((state) => state.noteTags);
	const isPublic = useNoteStore((state) => state.isPublic);
	const setValues = useNoteStore((state) => state.setValues);

	const saveHandler = async () => {
		if (db) {
			try {
				await updateNote({
					noteId,
					title,
					content,
					tags: noteTags,
					isPublic,
				});
				Router.push('/');
			} catch (err) {
				console.error(err);
				setValues({ error: errorTypes.savingError });
			}
		}
	};

	return <Editor saveHandler={saveHandler} />;
};
