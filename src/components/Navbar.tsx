'use client';
import React from 'react';
import styles from './navbar.module.css';
import logoAlster from '../../public/logoAlster.png';
import Image from 'next/image';

const Navbar = () => {
	const clearLocalStorage = () => {
		localStorage.clear();
	};

	return (
		<nav className={styles.navbar}>
			<Image src={logoAlster} height={30} width={30} alt='Alster logo' />
			<div className={styles.header}>
				<div>
					<label htmlFor='checkbox' className={styles.labelModeCheckbox}>
						Toggle dark/light mode
					</label>
					<input name='checkbox' type='checkbox' className={styles.checkbox} />
				</div>
				<button onClick={clearLocalStorage} className={styles.clearLsBtn}>
					Clear Local Storage
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
