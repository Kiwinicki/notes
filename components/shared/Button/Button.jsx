import Link from 'next/link';
import styles from './Button.module.scss';

export const Button = ({ children, error, ...rest }) => {
	return (
		<button
			className={`${styles.button} ${error ? styles.error : ''}`}
			{...rest}
		>
			{children}
		</button>
	);
};

export const ButtonLink = ({ children, href = '/', ...rest }) => (
	<Link href={href}>
		<a className={styles.buttonLink} {...rest}>
			{children}
		</a>
	</Link>
);
