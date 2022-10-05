import React, { useState, useEffect } from 'react';
import styles from './Switch.module.scss';

export const Switch = React.forwardRef(
	({ value, onChange, defaultChecked, ...props }, ref) => {
		const [isDefaultChecked, setIsDefaultChecked] = useState(null);
		useEffect(() => {
			if (defaultChecked !== undefined) {
				setIsDefaultChecked(defaultChecked);
			} else {
				setIsDefaultChecked(value);
			}
		}, [defaultChecked]);

		return (
			<div className={styles.container}>
				<input
					className={`${styles.input} ${value ? styles.checked : ''}`}
					value={value}
					type="checkbox"
					{...props}
					ref={ref}
					onChange={onChange}
					{...(isDefaultChecked && { defaultChecked: true })}
				/>
				<span></span>
			</div>
		);
	}
);

Switch.displayName = 'Switch';
