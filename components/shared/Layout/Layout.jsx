import styles from './Layout.module.scss';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { TagsSidebar } from './TagsSidebar/TagsSidebar';
import { useToggle } from '../../../hooks/useToggle';

export const Layout = ({ children }) => {
	const [isTagMenuOpen, toggleTagMenu] = useToggle(false);

	return (
		<div className={styles.container}>
			<Header {...{ toggleTagMenu }} />
			<TagsSidebar {...{ isTagMenuOpen, toggleTagMenu }} />
			<main className={styles.main}>{children}</main>
			<Footer />
		</div>
	);
};
