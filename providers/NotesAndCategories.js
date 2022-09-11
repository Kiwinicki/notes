import React, { createContext } from 'react';

const DataContext = createContext(null);

export const NotesAndCategories = ({ children }) => {
	return (
		<DataContext.Provider value={{ categories: [], notes: [] }}>
			{children}
		</DataContext.Provider>
	);
};
