import styles from './link.module.scss';

export const Link = ({ children, href }) => {
	return (
		<a href={href} className={styles.link} target="_blank" rel="noreferrer">
			{children}
		</a>
	);
};
