import { useState } from 'react';
import styles from './Editor.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import MonacoEditor from '@monaco-editor/react';
import { EditorNavBar } from './EditorNavBar/EditorNavBar';
import { MDXOutput } from './MDXOutput/MDXOutput';
import useNoteStore, { setValues } from '../../../store/useNoteStore';
import { Resizable } from 're-resizable';

export const Editor = ({ saveHandler }) => {
	const [{ data }] = useApp({});

	const content = useNoteStore((state) => state.content);

	const [isEditorOpen, setEditorOpen] = useState(false);
	const [isPreviewOpen, setPreviewOpen] = useState(true);

	const editorToggler = () =>
		setEditorOpen((prev) => (!isPreviewOpen ? true : !prev));
	const previewToggler = () =>
		setPreviewOpen((prev) => (!isEditorOpen ? true : !prev));

	return (
		<div className={styles.noteContainer}>
			<div className={styles.nav}>
				<EditorNavBar
					saveHandler={saveHandler}
					{...{ isEditorOpen, isPreviewOpen }}
					toggleEditor={editorToggler}
					togglePreview={previewToggler}
				/>
			</div>
			{data.userType === userTypes.admin && isEditorOpen && (
				<Resizable
					className={styles.editorContainer}
					handleClasses={{ right: styles.resize }}
				>
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
				</Resizable>
			)}
			{isPreviewOpen && (
				<div className={styles.contentContainer}>
					<MDXOutput />
				</div>
			)}
		</div>
	);
};
