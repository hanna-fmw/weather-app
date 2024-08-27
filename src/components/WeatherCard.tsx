import React from 'react'
import styles from './weather.module.css'
import '../app/globals.css'
import { IoIosClose } from 'react-icons/io'

type City = {
	cityName?: string
	temperature?: number
	currConditionText?: string
	country?: string
	isDay?: number
	deleteCity: () => void
	localTime?: string
	feelslike?: number
	humidity?: number
	cloud?: number
	wind?: number
}

const WeatherCard = ({ cityName, deleteCity, country }: City) => {
	return (
		<div className={styles.card}>
			<div className={styles.previousSearches}>
				<span className={styles.cityName}>{cityName}</span>
				<span className={styles.pipe}>&#x7c;</span>
				<span className={styles.country}>{country}</span>
			</div>
			<IoIosClose onClick={deleteCity} className={styles.closeBtn} />
		</div>
	)
}

export default WeatherCard
