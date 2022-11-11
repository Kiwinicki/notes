import { useEffect, useRef, useState } from 'react';
import styles from './Select.module.scss';
import { Listbox, Transition } from '@headlessui/react';

export const Select = ({
	options = [],
	selectedOptions = [],
	onChange,
	title,
	multiple,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const isSelected = (value) => {
		return selectedOptions.find((el) => el === value) ? true : false;
	};

	return (
		<Listbox
			className={styles.select}
			value={selectedOptions}
			onChange={onChange}
			open={isOpen}
			multiple={multiple}
		>
			{() => (
				<>
					<div className={styles.container}>
						<span className={styles.buttonContainer}>
							<Listbox.Button
								className={styles.selectButton}
								onClick={() => setIsOpen(!isOpen)}
								open={isOpen}
							>
								<span className={styles.buttonDescription}>
									{selectedOptions.length < 1
										? `Wybierz ${title}`
										: `Wybrano (${selectedOptions.length})`}
								</span>
								<span className={styles.buttonIcon}>
									<DropdownIcon />
								</span>
							</Listbox.Button>
						</span>
						<Transition
							unmount={false}
							show={isOpen}
							leave={styles.transition}
							leaveFrom={styles.leaveFrom}
							leaveTo={styles.leaveTo}
							className={styles.transition}
						>
							<Listbox.Options
								static
								className={styles.selectOptions}
							>
								{options.map(({ label, value }, i) => {
									const selected = isSelected(value);
									return (
										<Listbox.Option
											key={`${value}${i}`}
											value={value}
										>
											{({ active }) => (
												<div
													className={`${
														styles.option
													} ${
														active
															? styles.activeOption
															: ''
													}`}
												>
													<span>{label}</span>
													{selected && (
														<span
															className={
																styles.optionIcon
															}
														>
															<CheckIcon />
														</span>
													)}
												</div>
											)}
										</Listbox.Option>
									);
								})}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
};

const DropdownIcon = () => (
	<svg viewBox="0 0 20 20" fill="currentColor" stroke="currentColor">
		<path
			d="M7 7l3-3 3 3m0 6l-3 3-3-3"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		fill="currentColor"
		stroke="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
			clipRule="evenodd"
		/>
	</svg>
);
