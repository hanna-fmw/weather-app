'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React from 'react'
import { useState } from 'react'
import plusSign from '../../public/plusSign.png'
import { v4 as uuidv4 } from 'uuid'

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

type NewWeatherItem = {
	id: string
	cityName: string
	temperature: number
	currCondition: string
}

const getCurrentWeather = async (cityName: string) => {
	try {
		const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=9ec16cfb15ce4a1e88484621232211&q=${cityName}`)
		const data = await res.json()
		return data
	} catch (error) {
		console.error('Error:', error)
	}
}
export default function Home() {
	const [enteredCity, setEnteredCity] = useState<string>('')
	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([])

	const [weatherData, setWeatherData] = useState<null | WeatherType>(null)

	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredCity(e.target.value)
	}

	const searchCity = async () => {
		if (!enteredCity) {
			alert('Du måste ange en stad')
		}

		try {
			const data = await getCurrentWeather(enteredCity)

			// MISS: Update the state with the fetched data
			setWeatherData(data)

			if (!weatherData?.location?.name) {
				setIsCityNotFound(true)
			} else {
				addCity()
			}
		} catch (error) {
			console.error('Error:', error)
		}
		setEnteredCity('')
	}

	const clearCityNotFoundString = () => {
		if (isCityNotFound) {
			setIsCityNotFound(false)
		}
	}

	const addCity = () => {
		const newWeatherItem: NewWeatherItem = {
			id: new Date().getTime().toString(),
			cityName: weatherData?.location?.name,
			temperature: weatherData?.current?.temp_c,
			currCondition: weatherData?.current?.condition?.text,
		}
		setWeatherList([...weatherList, newWeatherItem])
		console.log(weatherList)
		return weatherList
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			searchCity()
		}
	}

	return (
		<main>
			<h1 className={styles.heading1}>Hur är vädret i...</h1>
			<div className={styles.inputContainer}>
				<label className={styles.label} htmlFor='search'>
					Plats:
				</label>
				<input
					className={styles.inputField}
					type='text'
					id='search'
					onChange={handleOnChange}
					value={enteredCity}
					onFocus={clearCityNotFoundString}
					autoComplete='off'
					onKeyDown={(e) => handleKeyDown(e)}
				/>
				<button onClick={searchCity} className={styles.btn}>
					<Image src={plusSign} height={20} width={20} alt='Plus Sign' />
				</button>
			</div>

			<div>
				{!weatherData?.location?.name && isCityNotFound && <p>Det finns ingen stad som matchar din sökning</p>}

				<div className={styles.container}>
					{weatherData &&
						weatherList.map((item, i) => {
							return (
								<div key={i}>
									{/* <div>{item?.cityName}</div> */}
									<WeatherCard cityName={item?.cityName} temperature={item?.temperature} currCondition={item?.currCondition} />
								</div>
							)
						})}

					{/* funkade: {item?.cityName} */}

					{/* {weatherData?.location?.name && (
						
						<div>{weatherData?.location?.name}</div>
						// <WeatherCard
						// 	cityName={weatherData?.location?.name}
						// 	temperature={weatherData?.current?.temp_c}
						// 	currCondition={weatherData?.current?.condition?.text}
						// />
					)} */}
				</div>
			</div>
			<Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} />
		</main>
	)
}

//http://api.weatherapi.com/v1/current.json?key=ce04308cc1fbad6c9ccc333fdd320aff&q=London&aqi=no

//const res = await fetch('http://api.weatherstack.com/current?access_key=1d63be06387a12f412ad56654a29768b&query=Madrid')
//Funkar:
//const res = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=ce04308cc1fbad6c9ccc333fdd320aff')
// const res = await fetch('http://omdbapi.com/?apikey=15d1e0a0&s=superman')
