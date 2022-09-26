import React from 'react';
import { Editor } from '../../shared/Editor/Editor';

export const NoteForAdmin = (note) => {
	return <Editor {...note} />;
};
