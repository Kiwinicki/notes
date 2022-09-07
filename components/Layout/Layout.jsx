import styles from './Layout.module.scss';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

export const Layout = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			{children}
			<Footer />
		</div>
	);
};
