import { useEffect } from 'react';
import styles from './Header.module.scss';
import { Button, ButtonLink } from '../../Button/Button';
import { Switch } from '../../Switch/Switch';
import { Input } from '../../Input/Input';
import { Select } from '../../Select/Select';
import { IconCheckbox } from '../../IconCheckbox/IconCheckbox';
import useRealmStore from '../../../../hooks/useRealmStore';
import useEditorStore, { errorTypes } from '../useEditorStore';

export const Header = ({ saveHandler, validate }) => {
	const categories = useRealmStore((state) => state.categories);
	const categoriesOptions = categories.map((cat) => ({
		value: cat.name,
		name: `${cat.name} (${cat.public ? 'publiczna' : 'prywatna'})`,
	}));

	const {
		title,
		categoryName,
		isPublic,
		setValues,
		error,
		isEditorOpen,
		isPreviewOpen,
		toggle,
	} = useEditorStore();

	useEffect(() => {
		!categoryName && setValues({ categoryName: categories[0].name });
	}, []);

	return (
		<header className={styles.container}>
			<div className={styles.checkboxes}>
				<IconCheckbox
					title="Edytor"
					value={isEditorOpen}
					onChange={() => toggle('isEditorOpen')}
				>
					<EditIcon />
				</IconCheckbox>
				<IconCheckbox
					title="Podgląd"
					value={isPreviewOpen}
					onChange={() => toggle('isPreviewOpen')}
				>
					<PreviewIcon />
				</IconCheckbox>
			</div>

			<form
				// onSubmit={handleSubmit(saveHandler)}
				onChange={() => {
					// const formState = getValues();
					validate();
				}}
				className={styles.form}
			>
				<div className={styles.titleContainer}>
					<label htmlFor="title" className="srOnly">
						Tytuł notatki
					</label>
					<Input
						id="title"
						placeholder="Tytuł notatki"
						title="Tytuł notatki"
						value={title}
						name="title"
						onChange={(e) => setValues({ title: e.target.value })}
						// {...register('title', { required: true })}
						{...(errorTypes.emptyTitle === error && { error: true })}
					/>
				</div>
				<div className={styles.switch}>
					<Switch
						name="isPublic"
						value={isPublic}
						onChange={() => toggle('isPublic')}
						title="Status notatki"
					/>
					<label>{isPublic ? 'Publiczna' : 'Prywatna'}</label>
				</div>
				<Select
					name="categoryName"
					value={categoryName}
					onChange={(e) => setValues({ categoryName: e.target.value })}
					// {...register('categoryName', { required: true })}
					options={categoriesOptions}
					title="Kategoria notatki"
				/>
				<Button
					type="submit"
					{...(error && { disabled: true })}
					error={error}
					onClick={saveHandler}
				>
					Zapisz
				</Button>
			</form>

			<nav className={styles.nav}>
				<ButtonLink href="/">Strona główna</ButtonLink>
			</nav>
		</header>
	);
};

const EditIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
		/>
	</svg>
);

const PreviewIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
		/>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
);
