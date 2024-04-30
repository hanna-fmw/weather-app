import styles from './popup.module.css';
type Props = {
	children: React.ReactNode;
};

import React from 'react';

const Popup = ({ children }: Props) => {
	return (
		<div>
			<div className={styles.popupMsg}>{children}</div>
		</div>
	);
};

export default Popup;
