import create from 'zustand';
import shallow from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

export const errorDescriptions = Object.freeze({
	serialize: 'Problem z MDX',
	emptyTitle: 'Brak tytułu notatki',
	emptyTag: 'Nie dodano żadnego tagu',
	savingError: 'Błąd podczas zapisywania notatki',
	publicNoteWithPrivateTag:
		'Ustawiono notatkę jako publiczną i dodano prywatny tag',
});

export const errorTypes = Object.freeze({
	serialize: 'serialize',
	emptyTitle: 'emptyTitle',
	emptyTag: 'emptyTag',
	savingError: 'savingError',
	publicNoteWithPrivateTag: 'publicNoteWithPrivateTag',
});

const useNoteStore = create(
	devtools(
		(set, get) =>
			Object.seal({
				noteId: null,
				title: '',
				content: '',
				isPublic: false,
				noteTags: [],
				errors: {
					serialize: false,
					emptyTitle: false,
					emptyTag: false,
					savingError: false,
					publicNoteWithPrivateTag: false,
				},
				setValues: (obj) => {
					const isValidKey = Object.keys(obj).every(
						(key) => key in get() && key !== 'errors'
					);
					if (isValidKey) set(obj, false, 'note/setValues');
				},
				setError: (errObj) => {
					const isValid = Object.entries(errObj).every(
						([key, val]) => key in errorTypes && typeof val === 'boolean'
					);
					if (isValid) {
						const newErrObj = { errors: { ...get().errors, ...errObj } };
						set(newErrObj, false, 'note/setError');
					}
				},
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
							isPublic: false,
							noteTags: [],
							errors: {
								serialize: false,
								publicNoteWithPrivateTag: false,
								emptyTitle: false,
								emptyTag: false,
								savingError: false,
							},
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
