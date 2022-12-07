import React, { useState, createContext, useContext } from 'react';

export const GlobalContext = createContext({
	city: '',
	state: '',
	setCity: () => {},
	setState: () => {},
});

export const searchContextProvider = ({ children }) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [currentCity, setCurrentCity] = useState('');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [currentState, setCurrentState] = useState('');

	return (
		<GlobalContext.Provider
			value={{
				city: currentCity,
				state: currentState,
				setCity: setCurrentCity,
				setState: setCurrentState,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
