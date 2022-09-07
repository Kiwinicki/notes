import React, { useContext, useEffect, useState } from 'react';
import * as RealmWeb from 'realm-web';

const RealmAppContext = React.createContext(null);
const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;

const RealmApp = ({ children }) => {
	const app = new RealmWeb.App({ id: REALM_APP_ID });
	const [user, setUser] = useState(null);
	const [userType, setUserType] = useState(userTypes.none);

	const logIn = async ({ login, password } = {}) => {
		const withLoginAndPasswd = login && password;
		let credentials = withLoginAndPasswd
			? RealmWeb.Credentials.emailPassword(login, password)
			: RealmWeb.Credentials.function();

		console.log('credentials', credentials);

		try {
			const user = await app.logIn(credentials);
			setUser(user); // app.currentUser
			setUserType(withLoginAndPasswd ? userTypes.admin : userTypes.visitor);
			return user;
		} catch (err) {
			console.error('Failed to log in', err);
			setUserType(withLoginAndPasswd ? userTypes.visitor : userTypes.none);
			setUser(null);
			return null;
		}
	};

	const logOut = () => {
		if (user !== null) {
			user.logOut();
			setUser(null);
			setUserType(userTypes.none);
		}
	};

	useEffect(() => {
		// always login as visitor on first render
		logIn();
	}, []);

	return (
		<RealmAppContext.Provider
			value={{
				logIn,
				logOut,
				user,
				userType,
			}}
		>
			{children}
		</RealmAppContext.Provider>
	);
};

export const useRealmApp = () => {
	const realmContext = useContext(RealmAppContext);
	if (realmContext == null) {
		throw new Error('useRealmApp() called outside of a RealmApp?');
	}
	return realmContext;
};

export const userTypes = {
	visitor: 'visitor',
	admin: 'admin',
	none: 'none',
};

export default RealmApp;
