import { useState, useRef } from 'react';
import styles from './Editor.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import MonacoEditor from '@monaco-editor/react';
import { EditorNavBar } from './EditorNavBar/EditorNavBar';
import { MDXOutput } from './MDXOutput/MDXOutput';
import useNoteStore, { setValues } from '../../../store/useNoteStore';
import { useToggle } from '../../../hooks/useToggle';

export const Editor = ({ saveHandler }) => {
	const [{ data }] = useApp({});

	const content = useNoteStore((state) => state.content);

	const [isEditorOpen, setEditorOpen] = useToggle(false);
	const [isPreviewOpen, setPreviewOpen] = useToggle(true);

	return (
		<div className={styles.noteContainer}>
			<div className={styles.nav}>
				<EditorNavBar
					saveHandler={saveHandler}
					toggleEditor={setEditorOpen}
					togglePreview={setPreviewOpen}
				/>
			</div>
			{data.userType === userTypes.admin && isEditorOpen && (
				<div className={styles.editorContainer}>
					<MonacoEditor
						defaultLanguage="markdown"
						defaultValue={content}
						value={content}
						theme="vs-dark"
						options={{
							minimap: { enabled: false },
							wordWrap: 'on',
							automaticLayout: true,
						}}
						onChange={(val) => setValues({ content: val })}
					/>
				</div>
			)}
			{isPreviewOpen && (
				<div className={styles.contentContainer}>
					<MDXOutput />
				</div>
			)}
		</div>
	);
};
