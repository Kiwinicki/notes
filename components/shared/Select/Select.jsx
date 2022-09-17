import React, { forwardRef } from 'react';
import styles from './Select.module.scss';
import PropTypes from 'prop-types';

export const Select = forwardRef(({ options = [], ...rest }, ref) => {
	return (
		<select {...rest} ref={ref} className={styles.select}>
			{options.length > 0 &&
				options.map(({ value, name }, i) => (
					<option value={value} key={i}>
						{name}
					</option>
				))}
		</select>
	);
});

Select.displayName = 'Select';

Select.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			value: PropTypes.string,
		})
	),
};
