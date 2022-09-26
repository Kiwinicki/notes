import create from 'zustand';

export const errorTypes = {
	none: false,
	serialize: 'Problem z MDX',
	category: 'Ustawiono notatkę jako publiczną i wybrano prywatną kategorię',
	emptyTitle: 'Brak tytułu notatki',
	savingError: 'Błąd podczas zapisywania notatki',
};

const useEditorStore = create((set) => ({
	title: '',
	content: '',
	serializedContent: null,
	categoryName: '',
	isPublic: true,
	setValues: (obj) => set((state) => ({ ...state, ...obj })),

	error: null,
	setError: (err) => ({ error: err }),

	toggle: (name) => set((state) => ({ [name]: !state[name] })),
	isEditorOpen: true,
	isPreviewOpen: true,
}));

export default useEditorStore;
