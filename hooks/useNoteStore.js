import create from 'zustand';
import shallow from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

export const errorTypes = {
	none: false,
	serialize: 'Problem z MDX',
	tag: 'Ustawiono notatkę jako publiczną i dodano prywatny tag',
	emptyTitle: 'Brak tytułu notatki',
	savingError: 'Błąd podczas zapisywania notatki',
	emptyTag: 'Nie dodano żadnego tagu',
};

const useNoteStore = create(
	devtools(
		(set, get) => ({
			noteId: null,
			title: '',
			content: '',
			isPublic: '',
			noteTags: [],
			error: errorTypes.none,
			setValues: (value) => set(value, false, 'note/setValues'),
			toggleIsPublic: (value) =>
				set(
					(state) => ({
						isPublic: value !== undefined ? value : !state.isPublic,
					}),
					false,
					'note/toggleIsPublic'
				),
			clearStore: () =>
				set(
					{
						noteId: null,
						title: '',
						content: '',
						isPublic: '',
						noteTags: [],
						error: errorTypes.none,
					},
					false,
					'note/clearStore'
				),
		}),
		{ name: 'noteStore' }
	),
	shallow
);

export default useNoteStore;
