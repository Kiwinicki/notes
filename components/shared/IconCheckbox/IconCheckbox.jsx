import React from 'react';
import styles from './IconCheckbox.module.scss';

export const IconCheckbox = React.forwardRef(
	({ children, title, ...rest }, ref) => {
		return (
			<label className={styles.iconCheckbox}>
				<input
					type="checkbox"
					{...rest}
					ref={ref}
					title={title}
					defaultChecked
				/>
				{children}
			</label>
		);
	}
);

IconCheckbox.displayName = 'IconCheckbox';
