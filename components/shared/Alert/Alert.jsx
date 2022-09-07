import styles from './Alert.module.scss';

export const Alert = ({ children, type, ...rest }) => {
	const alertTypes = {
		error: 'Error',
		warning: 'Warning',
		success: 'Success',
	};

	return (
		<span
			className={styles[`alert${alertTypes[type] || alertTypes.error}`]}
			{...rest}
		>
			{children}
		</span>
	);
};
