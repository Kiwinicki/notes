import React from 'react';
import styles from './Input.module.scss';

export const Input = React.forwardRef(
	({ type = 'text', error, ...rest }, ref) => (
		<input
			type={type}
			className={`${styles.input} ${error ? styles.error : ''}`}
			{...rest}
			ref={ref}
		/>
	)
);

Input.displayName = 'Input';
