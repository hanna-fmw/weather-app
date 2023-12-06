'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React, { useState, useEffect } from 'react'
// import plusSign from '../../public/plusSign.png'
import { useDebouncedCallback } from 'use-debounce'
import Popup from '@/components/Popup'

const apiKey = process.env.NEXT_PUBLIC_API_KEY

type WeatherData = {
	location: {
		name: string
		country: string
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
	country?: string
}

type CityItem = {
	id?: number
	name?: string
	country?: string
}

const searchCity = async (cityName: string) => {
	try {
		const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`)
		const cityData = await res.json()
		return cityData
	} catch (error) {
		console.error('Error:', error)
	}
}

export default function Home() {
	const [enteredCity, setEnteredCity] = useState<string>('')
	// const [weatherList, setWeatherList] = useState<NewWeatherItem[]>(() => {
	// 	const storedItems = localStorage.getItem('weatherList')
	// 	const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
	// 	return storedItemsArray
	// })
	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([])

	const [weatherData, setWeatherData] = useState<null | WeatherData>(null)
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	const [inputFieldEmptyPopup, setIsInputFieldEmptyPopup] = useState<boolean>(false)

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1)

	//ADD WEATHERLIST ARRAY TO LOCAL STORAGE
	useEffect(() => {
		if (weatherList.length !== 0) {
			localStorage.setItem('weatherList', JSON.stringify(weatherList))
		}
		console.log('weather list in useEffect', weatherList)
	}, [weatherList])

	//RETRIEVE FROM LOCAL STORAGE
	useEffect(() => {
		const storedItems = localStorage.getItem('weatherList')
		const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
		setWeatherList(storedItemsArray)
	}, [])

	useEffect(() => {
		if (weatherData && weatherData.location && weatherData.location.name && weatherData.location.country) {
			addCity()
		} else {
			console.log('oops')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	//CLEAR LOCAL STORAGE
	const clearLocalStorage = () => {
		localStorage.clear()
	}

	const handleOnChange = (value: string) => {
		setEnteredCity(value)
		debounced(value)
	}

	const debounced = useDebouncedCallback((value) => {
		triggerSearch()
	}, 100)

	//Fetch from Search API
	const triggerSearch = async () => {
		const searchedCity = await searchCity(enteredCity)
		setCityItems(searchedCity)
		//Reset activeItem to 0 as new items appear in the suggestion list
		setActiveItem(0)
	}

	//Fetch from "current" endbpoint  and pass in id from Search API response
	const getCurrentWeather = async (cityId: number | undefined) => {
		try {
			const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${cityId}`)
			const data = await res.json()

			if (
				data &&
				data.location &&
				data.location.name &&
				data.location.country &&
				data.current &&
				data.current.temp_c !== undefined &&
				data.current.temp_c !== null &&
				data.current.condition &&
				data.current.condition.text
			) {
				setWeatherData(data)
				setEnteredCity('')
				setCityItems([])
			} else {
				console.error('Invalid data structure for the city:', data)
			}

			return data
		} catch (error) {
			console.error('Error:', error)
		}
	}

	//SHOW/HIDE CITY NOT FOUND WARNING
	const timeoutCityNotFoundString = () => {
		setIsCityNotFound(true)
		setTimeout(() => {
			setIsCityNotFound(false)
		}, 2000)
		setEnteredCity('')
	}

	//SHOW/HIDE EMPTY INPUT FIELD WARNING
	const timeoutNoInput = () => {
		setIsInputFieldEmptyPopup(true)
		setTimeout(() => {
			setIsInputFieldEmptyPopup(false)
		}, 2000)
		setEnteredCity('')
	}

	//ADD CITY
	const addCity = () => {
		const newWeatherItem = {
			id: new Date().getTime().toString(),
			cityName: weatherData?.location.name,
			country: weatherData?.location.country,
			temperature: weatherData?.current.temp_c,
			currCondition: weatherData?.current.condition.text,
		}
		// weatherData &&
		const updatedWeatherList = [...weatherList, newWeatherItem]
		setWeatherList(updatedWeatherList)
		localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList))

		// //Retrieve from local storage
		// const storedItems = localStorage.getItem('weatherList')
		// const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
	}

	//DELETE CITY
	const deleteCity = (id: string) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		// localStorage.setItem('weatherItemAdded', JSON.stringify(updatedList))
		return updatedList
	}

	/////////////////////FUNKAR MIN EGEN//////////////////////////////
	// const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>, id: any) => {
	// 	if (e.key === 'ArrowDown' && activeItem < cityItems.length - 1) {
	// 		setActiveItem((prev) => prev + 1)
	// 	} else if (e.key === 'ArrowUp' && activeItem > 0) {
	// 		setActiveItem((prev) => prev - 1)
	// 	} else if (e.key === 'Enter') {
	// 		//If empty input field
	// 		if (!enteredCity) {
	// 			timeoutNoInput()
	// 			// alert('Du måste ange en stad')
	// 		} else {
	// 			//Check if entered city exists; show not found string if response does not contain enteredCity
	// 			const cityFound = cityItems.some((item) => item.name?.toLowerCase().includes(enteredCity.toLowerCase()))
	// 			if (!cityFound) {
	// 				timeoutCityNotFoundString()
	// 			} else if (activeItem >= 0) {
	// 				getCurrentWeather(cityItems[activeItem]?.id)
	// 			} else if (cityItems.length === 1) {
	// 				getCurrentWeather(cityItems[0]?.id)
	// 			}
	// 		}
	// 	}
	// }
	/////////////////////SLUT - FUNKAR MIN EGEN//////////////////////////////

	// //HANDLE KEY NAVIGATION (ARROWS & ENTER)
	// //Array.isArray(cityItems) to check that this is an array (to avoid "some is not a function" error)
	// const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	const cityFound = Array.isArray(cityItems) && cityItems.some((item) => item.name?.toLowerCase().includes(enteredCity.toLowerCase()))

	// 	switch (e.key) {
	// 		case 'ArrowDown':
	// 			Array.isArray(cityItems) && activeItem < cityItems.length - 1 && setActiveItem((prev) => prev + 1)
	// 			break

	// 		case 'ArrowUp':
	// 			activeItem > 0 && setActiveItem((prev) => prev - 1)
	// 			break

	// 		case 'Enter':
	// 			switch (true) {
	// 				case !enteredCity:
	// 					timeoutNoInput()
	// 					break

	// 				case !cityFound:
	// 					timeoutCityNotFoundString()
	// 					break

	// 				case activeItem >= 0:
	// 					Array.isArray(cityItems) && getCurrentWeather(cityItems[activeItem]?.id)
	// 					break

	// 				case Array.isArray(cityItems) && cityItems.length === 1:
	// 					Array.isArray(cityItems) && getCurrentWeather(cityItems[0]?.id)
	// 					break

	// 				default:
	// 					break
	// 			}
	// 			break

	// 		default:
	// 			break
	// 	}
	// }

	// //HANDLE KEY NAVIGATION (ARROWS & ENTER)
	// //Array.isArray(cityItems) to check that this is an array (to avoid "some is not a function" error)
	const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowDown':
				Array.isArray(cityItems) && activeItem < cityItems.length - 1 && setActiveItem((prev) => prev + 1)
				break

			case 'ArrowUp':
				activeItem > 0 && setActiveItem((prev) => prev - 1)
				break

			case 'Enter':
				handleEnterKey()
				break

			default:
				break
		}
	}

	const handleEnterKey = () => {
		const cityFound = Array.isArray(cityItems) && cityItems.some((item) => item.name?.toLowerCase().includes(enteredCity.toLowerCase()))

		if (!enteredCity) {
			timeoutNoInput()
			return
		}

		if (!cityFound) {
			timeoutCityNotFoundString()
			return
		}

		if (activeItem >= 0) {
			Array.isArray(cityItems) && getCurrentWeather(cityItems[activeItem]?.id)
			return
		}

		if (Array.isArray(cityItems) && cityItems.length === 1) {
			Array.isArray(cityItems) && getCurrentWeather(cityItems[0]?.id)
			return
		}
	}

	return (
		<main className={styles.main}>
			<div className={styles.header}>
				<h1 className={styles.h1}>Hur är vädret i ...</h1>
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

			<div className={styles.inputContainer}>
				<label className={styles.label} htmlFor='search'>
					Plats:
				</label>
				<input
					className={styles.inputField}
					type='text'
					id='search'
					onChange={(e) => handleOnChange(e.target.value)}
					value={enteredCity}
					autoComplete='off'
					onKeyDown={(e) => handleKeyNavigation(e)}
				/>
			</div>

			{isCityNotFound ? (
				<Popup>
					<div>Det finns ingen stad som matchar din sökning</div>
				</Popup>
			) : (
				''
			)}

			{inputFieldEmptyPopup ? (
				<Popup>
					<div>Du måste ange en stad</div>
				</Popup>
			) : (
				''
			)}

			<div className={styles.dataresult}>
				{Array.isArray(cityItems) ? (
					cityItems.map((item, i) => (
						<div
							key={i}
							onClick={() => getCurrentWeather(item?.id)}
							className={`${activeItem === i ? `${styles.searchListItem} ${styles.active}` : styles.searchListItem}`}>
							<span>{item?.name} </span>(<span>{item?.country}</span>)
						</div>
					))
				) : (
					<div onClick={() => getCurrentWeather(cityItems?.id)}>
						<span>{cityItems?.name}</span>
						<span>{cityItems?.country}</span>
						<span>{cityItems?.id}</span>
					</div>
				)}
			</div>
			{/* <div>{Array.isArray(cityItems) ? cityItems.map((item, i) => <div key={i}>{item?.name}</div>) : <div>{cityItems?.name}</div>}</div> */}

			<div className={styles.container}>
				{' '}
				{weatherList &&
					weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0)) &&
					weatherList.map((item, i) => (
						<div key={i}>
							{
								<WeatherCard
									cityName={item.cityName}
									temperature={item.temperature}
									currCondition={item.currCondition}
									country={item.country}
									deleteCity={() => deleteCity(item.id)}
								/>
							}
						</div>
					))}
			</div>
			<footer className={styles.footer}>
				<Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} />
			</footer>
		</main>
	)
}
