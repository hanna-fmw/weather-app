import React from 'react';
import styles from './weather.module.css';
import '../app/globals.css';
import Image from 'next/image';
import closeBtn from '../../public/closeBtn.svg';
import { IoIosClose } from 'react-icons/io';

type City = {
	cityName?: string;
	temperature?: number;
	currConditionText?: string;
	country?: string;
	isDay?: number;
	deleteCity: () => void;
	localTime?: string;
	feelslike?: number;
	humidity?: number;
	cloud?: number;
	wind?: number;
};

const WeatherCard = ({ cityName, temperature, currConditionText, deleteCity, country, localTime, feelslike, humidity, cloud, wind }: City) => {
	//Background colors
	const highTemp = temperature && temperature > 19;
	//Blue background
	const lowTempOrRain = (temperature && temperature < 1) || currConditionText?.toLowerCase().includes('rain');

	return (
		<div className={`${highTemp ? styles.bgHighTemp : lowTempOrRain ? styles.bgLowTemp : styles.bgModerateTemp} ${styles.card}`}>
			<div className={styles.previousSearches}>
				<span className={styles.cityName}>{cityName}</span>
				<span className={styles.pipe}>&#x7c;</span>
				<span className={styles.country}>{country}</span>
			</div>

			<IoIosClose onClick={deleteCity} className={styles.closeBtn} />
			{/* <Image src={closeBtn} width={20} height={20} alt='Close Button' onClick={deleteCity} /> */}
		</div>
	);
};

export default WeatherCard;
