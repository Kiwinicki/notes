import { useState, useEffect } from 'react';
import styles from './EditorNavBar.module.scss';
import { useApp, userTypes } from '../../../../store/useApp';
import { Button } from '../../Button/Button';
import { Input } from '../../Input/Input';
import { Switch } from '../../Switch/Switch';
import { Select } from '../../Select/Select';
import { useTags } from '../../../../store/useTags';
import useNoteStore, {
	setValues,
	toggleIsPublic,
} from '../../../../store/useNoteStore';

export const EditorNavBar = ({
	saveHandler,
	toggleEditor,
	togglePreview,
	isEditorOpen,
	isPreviewOpen,
}) => {
	const [{ data: appData }] = useApp();
	const [{ data: allTags, isSuccess: tagsSuccess }] = useTags();

	const { title, isPublic, tags } = useNoteStore();

	const [allOptions, setAllOptions] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState([]);

	// initial all Select options
	useEffect(() => {
		if (tagsSuccess) {
			const all = allTags.map((tag) => ({
				value: tag.name,
				label: `${tag.name} (${
					tag.isPublic ? 'publiczna' : 'prywatna'
				})`,
			}));
			setAllOptions(all);
		}
	}, [tagsSuccess]);

	// initial selected Select options
	useEffect(() => {
		if (allOptions.length > 0) {
			const initSelected = allOptions
				.filter((tag) => tags.includes(tag.value))
				.map((tag) => tag.value);
			console.log(initSelected);
			setSelectedOptions(initSelected);
		}
	}, [allOptions]);

	// sync selected options with noteStore
	useEffect(() => {
		if (allOptions.length > 0) {
			setValues({ tags: selectedOptions });
		}
	}, [selectedOptions]);

	if (appData.userType === userTypes.admin) {
		return (
			<div style={{ position: 'relative', overflow: 'hidden' }}>
				<div className={styles.outsideContainer}>
					<nav className={styles.insideContainer}>
						<Button active={isEditorOpen} onClick={toggleEditor}>
							Edytor
						</Button>
						<Button active={isPreviewOpen} onClick={togglePreview}>
							Podgląd
						</Button>
						<div className={styles.titleContainer}>
							<label htmlFor="title" className="srOnly">
								Tytuł notatki
							</label>
							<Input
								id="title"
								placeholder="Tytuł notatki"
								title="Tytuł notatki"
								value={title}
								onChange={(e) =>
									setValues({ title: e.target.value })
								}
								// TODO: error handling (validation and displaying)
								// {...(errors[errorTypes.emptyTitle] && { error: true })}
							/>
						</div>
						<div className={styles.switch}>
							<Switch
								id="switch"
								value={isPublic}
								onChange={() => toggleIsPublic()}
								title={`Status notatki: ${
									isPublic ? 'Publiczna' : 'Prywatna'
								}`}
							/>
							{/* TODO: some slim label for isPublic switch */}
							{/* <label htmlFor="switch" >{isPublic ? 'Publiczna' : 'Prywatna'}</label> */}
						</div>
						<Select
							options={allOptions}
							selectedOptions={selectedOptions}
							onChange={setSelectedOptions}
							title={'tagi'}
							multiple
							// TODO: error handling (validation and displaying)
							// {...(errors[errorTypes.emptyTag] && { error: true })}
						/>
						{/* TODO: disable submit button if errors */}
						<Button
							type="submit"
							onClick={() => {
								console.log(selectedOptions);
								const tags = selectedOptions.map(
									(tag) => tag.value
								);
								console.log(tags);
								saveHandler();
							}}
						>
							Zapisz
						</Button>
					</nav>
				</div>
			</div>
		);
	}
};
