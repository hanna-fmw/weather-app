import React from 'react'
import styles from './weather.module.css'
import '../app/globals.css'
import sunny from '../../public/sun.svg'
import cloudy from '../../public/cloud.svg'
import snowy from '../../public/snow.svg'
import fallback from '../../public/fallback.svg'
import Image from 'next/image'
import closeBtn from '../../public/closeBtn.svg'

type City = {
	cityName: string
	temperature: number
	currCondition: string
}

const WeatherCard = ({ cityName, temperature, currCondition }: City) => {
	// console.log(currCondition)
	//Background colors
	const highTemp = temperature > 19
	//Blue background
	const lowTempOrRain = temperature < 1 || currCondition.toLowerCase().includes('rain')
	//Else (i.e. 1-19 degrees and no rain) yellow background

	return (
		<div className={`${highTemp ? styles.bgHighTemp : lowTempOrRain ? styles.bgLowTemp : styles.bgModerateTemp} ${styles.card}`}>
			<div className={styles.closeBtn}>
				<Image src={closeBtn} width={30} height={30} alt='Close Button' />
			</div>

			<div>
				{(() => {
					if (currCondition.toLowerCase().includes('sunny')) {
						return <Image src={sunny} height={60} width={60} alt='Sunny Weather icon' />
					} else if (currCondition.toLowerCase().includes('cloudy')) {
						return <Image src={cloudy} height={60} width={60} alt='Cloudy Weather icon' />
					} else if (currCondition.toLowerCase().includes('snowy')) {
						return <Image src={snowy} height={60} width={60} alt='Snowy Weather icon' />
					} else {
						return <Image src={fallback} height={60} width={60} alt='Fallback Weather icon' />
					}
				})()}
			</div>
			<div>
				<span>{temperature}°C</span>
				<div>{cityName}</div>
			</div>
		</div>
	)
}

export default WeatherCard
