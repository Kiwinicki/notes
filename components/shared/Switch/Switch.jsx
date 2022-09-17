import React from 'react';
import styles from './Switch.module.scss';

export const Switch = React.forwardRef(({ ...props }, ref) => {
	return (
		<div className={styles.switch}>
			<input type="checkbox" {...props} ref={ref} />
			<span></span>
		</div>
	);
});

Switch.displayName = 'Switch';
