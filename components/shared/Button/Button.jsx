import styles from './Button.module.scss';

export const Button = ({ children, ...rest }) => {
	return (
		<button className={styles.button} {...rest}>
			{children}
		</button>
	);
};
