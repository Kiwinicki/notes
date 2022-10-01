import React from 'react';
import useRealmStore from '../../../hooks/useRealmStore';
import { Editor } from '../../shared/Editor/Editor';

export const NoteForAdmin = (note) => {
	const db = useRealmStore((state) => state.db);

	const saveHandler = async (data) => {
		console.log(data);
		if (db) {
			const updateResult = await db
				.collection('notes')
				.updateOne({ _id: note._id }, { ...data, editDate: new Date() });
			console.log(updateResult);
			// TODO: redirect to home page when inserted
		}
	};

	return <Editor {...note} saveHandler={saveHandler} />;
};
