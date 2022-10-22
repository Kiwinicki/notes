import React from 'react';
import Router from 'next/router';
import useNoteStore, { errorTypes } from '../../../hooks/useNoteStore';
import { Editor } from '../../shared/Editor/Editor';
import { useApp } from '../../../store/useApp';

export const NoteForAdmin = () => {
	const [
		{
			data: { db },
		},
		{ updateNote },
	] = useApp();

	const noteId = useNoteStore((state) => state.noteId);
	const title = useNoteStore((state) => state.title);
	const content = useNoteStore((state) => state.content);
	const noteTags = useNoteStore((state) => state.noteTags);
	const isPublic = useNoteStore((state) => state.isPublic);
	const setError = useNoteStore((state) => state.setError);

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
				setError({ [errorTypes.savingError]: false });
				// TODO: saving with further editing
				Router.push('/');
			} catch (err) {
				setError({ [errorTypes.savingError]: true });
				console.error(err);
			}
		}
	};

	return (
		<Editor
			saveHandler={saveHandler}
			{...{ saveHandler, title, content, noteTags, isPublic }}
		/>
	);
};
