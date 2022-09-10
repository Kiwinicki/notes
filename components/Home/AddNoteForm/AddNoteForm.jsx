import styles from './AddNoteForm.module.scss';

export const AddNoteForm = () => {
	return (
		<form>
			<label htmlFor="title">Tytuł notatki</label>
			<input type="text" name="title" id="title" placeholder="tytuł" />

			<textarea name="title">treść notatki...</textarea>

			<label htmlFor="publicTrue">Notatka publiczna</label>
			<input type="radio" name="isPublic" id="publicTrue" value={true} />

			<label htmlFor="publicFalse">Notatka prywatna</label>
			<input
				type="radio"
				name="isPublic"
				id="publicFalse"
				value={false}
				defaultChecked
			/>

			<button type="submit">Zatwierdź</button>
		</form>
	);
};
