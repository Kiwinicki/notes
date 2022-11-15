import Link from 'next/link';
import styles from './Button.module.scss';

export const Button = ({ className = '', children, error, ...rest }) => {
	return (
		<button
			className={`${styles.button} ${
				error ? styles.error : ''
			} ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
};

export const ButtonLink = ({ children, href = '/', className, ...rest }) => (
	<Link href={href}>
		<a className={`${styles.buttonLink} ${className}`} {...rest}>
			{children}
		</a>
	</Link>
);
