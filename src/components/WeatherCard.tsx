import React from 'react'
import styles from './weather.module.css'
import '../app/globals.css'
import sun from '../../public/sun.svg'
import Image from 'next/image'
import closeBtn from '../../public/closeBtn.svg'

type City = {
	cityName: string
	temperature: number
	rain: string
}

const WeatherCard = ({ cityName, temperature, rain }: City) => {
	const highTemp = temperature > 20
	const lowTempOrRain = temperature < 20 || rain.includes('iam')
	//MISS: const moderateTemp = temperature > 0 && temperature < 19
	const moderateTemp = !highTemp && !lowTempOrRain
	return (
		<div className={`${highTemp ? styles.bgHighTemp : lowTempOrRain ? styles.bgLowTemp : moderateTemp} ${styles.card}`}>
			<div className={styles.closeBtn}>
				<Image src={closeBtn} width={30} height={30} alt='Close Button' />
			</div>

			<div>
				<Image src={sun} height={60} width={60} alt='Sun icon' />
			</div>
			<div>
				<span>{temperature}°C</span>
				<div>{cityName}</div>
			</div>
		</div>
	)
}

export default WeatherCard
