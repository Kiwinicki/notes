import styles from './Layout.module.scss';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { CategoriesSidebar } from './CategoriesSidebar/CategoriesSidebar';

export const Layout = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<CategoriesSidebar />
				{children}
			</main>
			<Footer />
		</div>
	);
};
