import React from 'react';
import styles from './Input.module.scss';

export const Input = React.forwardRef(
	({ type = 'text', error, className = '', ...rest }, ref) => (
		<input
			type={type}
			className={`${styles.input} ${error ? styles.error : ''} ${className}`}
			{...rest}
			ref={ref}
		/>
	)
);

Input.displayName = 'Input';
