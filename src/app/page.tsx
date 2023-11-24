'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React, { useState, useEffect } from 'react'
import plusSign from '../../public/plusSign.png'

type WeatherData = {
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
	cityName?: string
	temperature?: number
	currCondition?: string
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
	const [weatherData, setWeatherData] = useState<null | WeatherData>(null)
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	// const getWeatherList = JSON.parse(localStorage.getItem('weatherItemAdded'))
	useEffect(() => {
		// if (getWeatherList === null) {
		// 	setWeatherList([])
		// } else {
		// 	setWeatherList(getWeatherList)
		// }

		// if (getWeatherList === null) {
		// 	setWeatherList([])
		// } else if (typeof window !== 'undefined') {
		// 	setWeatherList(getWeatherList)
		// }

		// if (typeof window !== 'undefined') {
		// 	setWeatherList(getWeatherList)
		// }

		if (weatherData && weatherData.location && weatherData.location.name) {
			addCity()
		} else {
			setIsCityNotFound(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredCity(e.target.value)
	}

	const searchCity = async () => {
		try {
			const data = await getCurrentWeather(enteredCity)
			setWeatherData(data)
			console.log(data)
		} catch (error) {
			console.error('Error:', error)
		}
		setEnteredCity('')
		setIsCityNotFound(false)
	}

	const clearCityNotFoundString = () => {
		if (isCityNotFound) {
			setIsCityNotFound(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			searchCity()
		}
	}

	const addCity = () => {
		const newWeatherItem: NewWeatherItem = {
			id: new Date().getTime().toString(),
			cityName: weatherData?.location?.name,
			temperature: weatherData?.current?.temp_c,
			currCondition: weatherData?.current?.condition?.text,
		}

		//If-sats för att kolla att ingen undefined
		//newWeatherItem.cityName !== undefined
		//leta i objekt - kolla med Object.key
		if (weatherData && weatherData.location && newWeatherItem.cityName && newWeatherItem.temperature && newWeatherItem.currCondition) {
			setWeatherList([...weatherList, newWeatherItem])
			return weatherList
		}
		// localStorage.setItem('weatherItemAdded', JSON.stringify([...weatherList, newWeatherItem]))
	}

	const deleteCity = (id: string) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		// localStorage.setItem('weatherItemAdded', JSON.stringify(updatedList))
		return updatedList
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
				{weatherData && isCityNotFound && <p>Det finns ingen stad som matchar din sökning</p>}

				<div className={styles.container}>
					{weatherData &&
						weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0)) &&
						// weatherList.filter((item) => (enteredCity.toLowerCase() === '' ? item : item.cityName?.toLowerCase().includes(enteredCity))) &&
						weatherList.map((item, i) => (
							<div key={i}>
								{item.cityName && item.temperature && item.currCondition && (
									<WeatherCard
										cityName={item.cityName}
										temperature={item.temperature}
										currCondition={item.currCondition}
										deleteCity={() => deleteCity(item.id)}
									/>
								)}
							</div>
						))}
				</div>
			</div>
			<Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} />
		</main>
	)
}
