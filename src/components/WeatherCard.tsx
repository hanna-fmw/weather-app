import React from 'react'
import styles from './weather.module.css'
import '../app/globals.css'
import sunny from '../../public/icons/day/113.png'
import cloudy from '../../public/icons/day/116.png'
import snowy from '../../public/icons/day/338.png'
import rainy from '../../public/icons/day/308.png'
import fallback from '../../public/icons/day/119.png'
import Image from 'next/image'
import closeBtn from '../../public/closeBtn.svg'

type City = {
	cityName?: string
	temperature?: number
	currConditionText?: string
	country?: string
	isDay?: number
	deleteCity: () => void
}

const WeatherCard = ({ cityName, temperature, currConditionText, deleteCity, country }: City) => {
	// console.log(currCondition)
	//Background colors
	const highTemp = temperature && temperature > 19
	//Blue background
	const lowTempOrRain = (temperature && temperature < 1) || currConditionText?.toLowerCase().includes('rain')
	//Else (i.e. 1-19 degrees and no rain) yellow background

	return (
		<div className={`${highTemp ? styles.bgHighTemp : lowTempOrRain ? styles.bgLowTemp : styles.bgModerateTemp} ${styles.card}`}>
			<div className={styles.closeBtn}>
				<Image src={closeBtn} width={20} height={20} alt='Close Button' onClick={deleteCity} />
			</div>

			{/* <div>
				{currConditionText &&
					(currConditionText.toLowerCase().includes('sunny') ? (
						<Image src={sunny} height={30} width={30} alt='Sunny Weather icon' />
					) : currConditionText.toLowerCase().includes('cloud') ? (
						<Image src={cloudy} height={30} width={30} alt='Cloudy Weather icon' />
					) : currConditionText.toLowerCase().includes('snow') ? (
						<Image src={snowy} height={30} width={30} alt='Snowy Weather icon' />
					) : currConditionText.toLowerCase().includes('rain') ? (
						<Image src={rainy} height={30} width={30} alt='Rainy Weather icon' />
					) : (
						<Image src={fallback} height={30} width={30} alt='Fallback Weather icon' />
					))}
			</div> */}

			<div>
				<span className={styles.temp}>{temperature}°C</span>
				<span className={styles.cityName}>{cityName}</span>
				<span className={styles.cityName}>({country})</span>
				<div>
					<small>
						{/* <span>{isDay === 1 ? <span>Day</span> : <span>Night</span>}</span> */}
						<span>{currConditionText}</span>
					</small>
				</div>
			</div>
		</div>
	)
}

export default WeatherCard
