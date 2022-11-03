import { useState, useRef } from 'react';
import styles from './Editor.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import MonacoEditor from '@monaco-editor/react';
import { EditorNavBar } from './EditorNavBar/EditorNavBar';
import { MDXOutput } from './MDXOutput/MDXOutput';
import useNoteStore, { setValues } from '../../../store/useNoteStore';

export const Editor = ({ saveHandler }) => {
	const [{ data }] = useApp({});

	const content = useNoteStore((state) => state.content);

	const editorRef = useRef();
	const [width, setWidth] = useState(200);

	const [initialPos, setInitialPos] = useState(null);
	const [initialSize, setInitialSize] = useState(null);

	const initial = (e) => {
		setInitialPos(e.clientX);
		setInitialSize(editorRef.current.offsetWidth);
	};

	const resize = (e) => {
		setWidth(parseInt(initialSize) + parseInt(e.clientX - initialPos + 'px'));
	};

	return (
		<div className={styles.noteContainer}>
			<EditorNavBar saveHandler={saveHandler} />
			<div className={styles.contentContainer}>
				{data.userType === userTypes.admin && (
					<>
						<div
							className={styles.editorContainer}
							style={{ width }}
							ref={editorRef}
						>
							<MonacoEditor
								defaultLanguage="markdown"
								defaultValue={content}
								value={content}
								theme="vs-dark"
								// className={styles.editor}
								options={{
									minimap: { enabled: false },
									wordWrap: 'on',
									automaticLayout: true,
								}}
								onChange={(val) => setValues({ content: val })}
							/>
						</div>
						<div
							className={styles.resizeBar}
							draggable
							onDragStart={initial}
							onDrag={resize}
						/>
					</>
				)}
				<MDXOutput />
			</div>
		</div>
	);
};
