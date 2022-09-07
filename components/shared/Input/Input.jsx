import styles from './Input.module.scss';

export const Input = ({ type = 'text', ...rest }) => (
	<input type={type} className={styles.input} {...rest} />
);
