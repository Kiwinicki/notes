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
		}, []);

		return (
			<div className={styles.switch}>
				<input
					type="checkbox"
					{...props}
					ref={ref}
					{...(isDefaultChecked && { defaultChecked: true })}
				/>
				<span></span>
			</div>
		);
	}
);

Switch.displayName = 'Switch';
