import styles from './Layout.module.scss';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { TagsSidebar } from './TagsSidebar/TagsSidebar';

export const Layout = ({ children }) => {
	return (
		<div className={styles.container}>
			<Header />
			<div className={styles.main}>
				<TagsSidebar />
				{children}
			</div>
			<Footer />
		</div>
	);
};
