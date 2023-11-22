'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React from 'react'
import { useState } from 'react'
import plusSign from '../../public/plusSign.png'

type WeatherType = {
	location: {
		name: string
	}

	current: {
		temp_c: number
		condition: {
			text: string
		}
	}
}

const getCurrentWeather = async (cityName: string) => {
	try {
		const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=9ec16cfb15ce4a1e88484621232211&q=${cityName}`)
		const data = await res.json()
		// console.log(data)
		return data
	} catch (error) {
		console.error('Error:', error)
	}
}
export default function Home() {
	const [city, setCity] = useState<string>('')
	// const [cities, setCities] = useState([])
	const [weatherData, setWeatherData] = useState<null | WeatherType>(null)

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCity(e.target.value)
	}

	const handleSubmit = async () => {
		console.log(city)

		try {
			const data = await getCurrentWeather(city)
			console.log(data)

			// MISS: Update the state with the fetched data
			setWeatherData(data)
			console.log(weatherData)
			console.log(typeof weatherData?.current?.condition?.precip_mm)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<main>
			<h1 className={styles.heading1}>Hur är vädret i...</h1>
			<div className={styles.inputContainer}>
				<label className={styles.label} htmlFor='search'>
					Plats:
				</label>
				<input className={styles.inputField} type='text' id='search' onChange={handleOnChange} value={city} />
				<button onClick={handleSubmit}>
					<Image src={plusSign} height={20} width={20} alt='Plus Sign' />
				</button>
			</div>
			<section className={styles.container}>
				{weatherData && weatherData?.location && weatherData.current && (
					<WeatherCard
						cityName={weatherData?.location?.name}
						temperature={weatherData?.current?.temp_c}
						rain={weatherData?.current?.condition?.text}
					/>
				)}
			</section>
			<Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} />
		</main>
	)
}

//http://api.weatherapi.com/v1/current.json?key=ce04308cc1fbad6c9ccc333fdd320aff&q=London&aqi=no

//const res = await fetch('http://api.weatherstack.com/current?access_key=1d63be06387a12f412ad56654a29768b&query=Madrid')
//Funkar:
//const res = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=ce04308cc1fbad6c9ccc333fdd320aff')
// const res = await fetch('http://omdbapi.com/?apikey=15d1e0a0&s=superman')
