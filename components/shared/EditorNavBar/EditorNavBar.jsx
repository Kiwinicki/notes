import { useState, useEffect } from 'react';
import styles from './EditorNavBar.module.scss';
import { useApp, userTypes } from '../../../store/useApp';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';
import { Select } from '../Select/Select';
import { useTags } from '../../../store/useTags';
import { useRouter } from 'next/router';
import { useNotes } from '../../../store/useNotes';
import { useToggle } from '../../../hooks/useToggle';

export const EditorNavBar = ({ saveHandler }) => {
	const { query } = useRouter();

	const [{ data: appData }] = useApp();
	const [{ data: noteData, isSuccess }] = useNotes({ noteId: query.noteId });
	const [{ data: tagData }] = useTags();

	const { allOptions, selectedOptions, setSelectedOptions } = useTagList({
		allTags: tagData,
		noteTags: noteData?.tags || [],
	});

	const [title, setTitle] = useState('');
	const [isPublic, toggleIsPublic] = useToggle(false);

	useEffect(() => {
		setTitle(noteData?.title || '');
		toggleIsPublic(noteData?.isPublic || false);
	}, [isSuccess]);

	if (appData.userType === userTypes.admin) {
		return (
			<nav className={styles.container}>
				<Button>Edytor</Button>
				<Button>Podgląd</Button>
				<div className={styles.titleContainer}>
					<label htmlFor="title" className="srOnly">
						Tytuł notatki
					</label>
					<Input
						id="title"
						placeholder="Tytuł notatki"
						title="Tytuł notatki"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						// TODO: error handling (validation and displaying)
						// {...(errors[errorTypes.emptyTitle] && { error: true })}
					/>
				</div>
				<div className={styles.switch}>
					<Switch
						id="switch"
						value={isPublic}
						onChange={() => toggleIsPublic()}
						title={`Status notatki: ${isPublic ? 'Publiczna' : 'Prywatna'}`}
					/>
					{/* TODO: some slim label for isPublic switch */}
					{/* <label htmlFor="switch" >{isPublic ? 'Publiczna' : 'Prywatna'}</label> */}
				</div>
				<Select
					multiple
					value={selectedOptions}
					onChange={(e) => setSelectedOptions(e)}
					options={allOptions}
					title="Lista tagów"
					// TODO: error handling (validation and displaying)
					// {...(errors[errorTypes.emptyTag] && { error: true })}
				/>
				{/* TODO: disable submit button if errors */}
				<Button
					type="submit"
					onClick={() => {
						console.log(selectedOptions);
						const tags = selectedOptions.map((tag) => tag.value);
						saveHandler({ title, isPublic, tags });
					}}
				>
					Zapisz
				</Button>
			</nav>
		);
	}
};

const useTagList = ({ allTags, noteTags }) => {
	// all options for Select
	const [allOptions, setAllOptions] = useState([]);
	useEffect(() => {
		if (allTags) {
			const all = allTags.map((tag) => ({
				value: tag.name,
				label: `${tag.name} (${tag.isPublic ? 'publiczna' : 'prywatna'})`,
			}));
			setAllOptions(all);
		}
	}, [allTags]);

	// initial selected options for Select
	const [selectedOptions, setSelectedOptions] = useState([]);
	useEffect(() => {
		if (allOptions.length > 0) {
			const initSelected = allOptions.filter((tag) =>
				noteTags.includes(tag.value)
			);
			setSelectedOptions(initSelected);
		}
	}, []);

	return { allOptions, selectedOptions, setSelectedOptions };
};
