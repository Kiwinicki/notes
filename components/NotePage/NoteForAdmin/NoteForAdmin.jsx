import Router from 'next/router';
import React from 'react';
import useNoteStore, { errorTypes } from '../../../hooks/useNoteStore';
import useRealmStore from '../../../hooks/useRealmStore';
import { Editor } from '../../shared/Editor/Editor';

export const NoteForAdmin = () => {
	const db = useRealmStore((state) => state.db);
	const { title, content, noteTags, isPublic, setValues, clearStore } =
		useNoteStore();

	const saveHandler = async () => {
		if (db) {
			try {
				console.log(noteTags);
				const updateResult = await db
					.collection('notes')
					.updateOne(
						{ _id: note._id },
						{ title, content, tags: noteTags, isPublic, editDate: new Date() }
					);
				console.log(updateResult);
				clearStore();
				// TODO: redirect to home
				// Router.push('/');
			} catch (err) {
				console.error(err);
				setValues({ error: errorTypes.savingError });
			}
		}
	};

	return <Editor saveHandler={saveHandler} />;
};
