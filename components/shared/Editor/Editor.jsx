import styles from './Editor.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import MonacoEditor from '@monaco-editor/react';
import { EditorNavBar } from './EditorNavBar/EditorNavBar';
import { MDXOutput } from './MDXOutput/MDXOutput';
import useNoteStore, { setValues } from '../../../store/useNoteStore';

export const Editor = ({ saveHandler }) => {
	const [{ data }] = useApp({});

	const content = useNoteStore((state) => state.content);

	return (
		<div className={styles.noteContainer}>
			<EditorNavBar saveHandler={saveHandler} />
			<div className={styles.contentContainer}>
				{data.userType === userTypes.admin && (
					<>
						<div>
							<MonacoEditor
								defaultLanguage="markdown"
								defaultValue={content}
								value={content}
								theme="vs-dark"
								className={styles.editor}
								options={{
									minimap: { enabled: false },
									wordWrap: 'on',
									automaticLayout: true,
								}}
								onChange={(val) => setValues({ content: val })}
							/>
						</div>
						{/* TODO: resizing editor  */}
						<div className={styles.resizeBar} />
					</>
				)}
				<MDXOutput />
			</div>
		</div>
	);
};
