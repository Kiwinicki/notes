import create from 'zustand';

export const useNoteStore = create((set, get) => ({
	title: '',
	content: '',
	isPublic: null,
	tags: [],
	error: false,
	setValue: (value) => set(value),
}));
