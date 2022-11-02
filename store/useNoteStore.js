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
		() =>
			Object.seal({
				title: '',
				content: 'Zacznij pisać...',
				isPublic: false,
				tags: [],
				errors: {
					serialize: false,
					emptyTitle: false,
					emptyTag: false,
					savingError: false,
					publicNoteWithPrivateTag: false,
				},
			}),
		{ name: 'noteStore' }
	),
	shallow
);

export default useNoteStore;

export const setValues = (obj) => {
	const isValidKey = Object.keys(obj).every(
		(key) => key in useNoteStore.getState() && key !== 'errors'
	);

	if (isValidKey) useNoteStore.setState(obj, false, 'note/setValues');
};

export const clearStore = () =>
	useNoteStore.setState(
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
	);

export const setError = (errObj) => {
	const isValid = Object.entries(errObj).every(
		([key, val]) => key in errorTypes && typeof val === 'boolean'
	);
	if (isValid) {
		const newErrObj = {
			errors: { ...useNoteStore.getState().errors, ...errObj },
		};
		useNoteStore.setState(newErrObj, false, 'note/setError');
	}
};

export const toggleIsPublic = (value) =>
	useNoteStore.setState(
		(state) => ({
			isPublic: value !== undefined ? value : !state.isPublic,
		}),
		false,
		'note/toggleIsPublic'
	);
