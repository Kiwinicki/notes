import create from 'zustand';

export const errorTypes = {
	none: false,
	serialize: 'Problem z MDX',
	tag: 'Ustawiono notatkę jako publiczną i dodano prywatny tag',
	emptyTitle: 'Brak tytułu notatki',
	savingError: 'Błąd podczas zapisywania notatki',
	emptyTag: 'Nie dodano żadnego tagu',
};

const useNoteStore = create((set, get) => ({
	title: '',
	content: '',
	isPublic: null,
	noteTags: [],
	error: errorTypes.none,
	setValues: (value) => set(value),
	clearStore: () =>
		set({
			title: '',
			content: '',
			isPublic: null,
			noteTags: [],
			error: errorTypes.none,
		}),
}));

export default useNoteStore;
