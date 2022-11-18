import styles from './Checkbox.module.scss';

export const Checkbox = ({ children }) => {
	return (
		<p className={styles.container}>
			<input type="checkbox" className={styles.checkbox} />
			<span className={styles.text}>{children}</span>
		</p>
	);
};
