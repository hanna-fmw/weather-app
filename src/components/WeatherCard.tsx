import React from 'react';
import styles from './weather.module.css';
import '../app/globals.css';
import Image from 'next/image';
import closeBtn from '../../public/closeBtn.svg';

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
	// console.log(currCondition)
	//Background colors
	const highTemp = temperature && temperature > 19;
	//Blue background
	const lowTempOrRain = (temperature && temperature < 1) || currConditionText?.toLowerCase().includes('rain');
	//Else (i.e. 1-19 degrees and no rain) yellow background

	return (
		<div className={`${highTemp ? styles.bgHighTemp : lowTempOrRain ? styles.bgLowTemp : styles.bgModerateTemp} ${styles.card}`}>
			<div className={styles.closeBtn}>
				<Image src={closeBtn} width={20} height={20} alt='Close Button' onClick={deleteCity} />
			</div>

			<div>
				<span className={styles.temp}>{temperature}°C</span>
				<span className={styles.cityName}>{cityName}</span>
				<span className={styles.country}>({country})</span>
				<div className={styles.weatherDetails}>
					<small>
						<span>{localTime}</span>
						<span className={styles.pipe}>&#x7c;</span>
						<span>{currConditionText}</span>
					</small>

					<small>
						<span>Feels&nbsp;like:&nbsp;{feelslike}&#176;</span>
						<span className={styles.pipe}>&#x7c;</span>
						<span>Humidity:&nbsp;{humidity}%</span>
						<div>
							<span>Cloud:&nbsp;{cloud}%</span>
							<span className={styles.pipe}>&#x7c;</span>
							<span>Wind:&nbsp;{wind}m/s</span>
						</div>
					</small>
				</div>
			</div>
		</div>
	);
};

export default WeatherCard;
