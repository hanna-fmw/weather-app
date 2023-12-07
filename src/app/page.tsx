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

	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([])

	const [weatherData, setWeatherData] = useState<null | WeatherData>(null)
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	const [inputFieldEmptyPopup, setIsInputFieldEmptyPopup] = useState<boolean>(false)

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1)

	//Already added
	const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false)

	//RETRIEVE FROM LOCAL STORAGE
	useEffect(() => {
		const storedItems = localStorage.getItem('weatherList')
		const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
		console.log('Stored Items Array', storedItemsArray)
		setWeatherList(storedItemsArray)
	}, [])

	//Add weatherList array to local storage>ADD WEATHERLIST ARRAY TO LOCAL STORAGE
	useEffect(() => {
		if (weatherList.length !== 0) {
			const updatedWeatherList = weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0))
			setWeatherList(updatedWeatherList)
			localStorage.setItem('weatherList', JSON.stringify(weatherList))
		}
	}, [weatherList])

	// Add event listener for beforeunload and unload
	useEffect(() => {
		const handleBeforeUnload = () => {
			// Update local storage with the latest temperatures
			localStorage.setItem('weatherList', JSON.stringify(weatherList))
		}

		const handleUnload = async () => {
			// Retrieve the latest data before the page is unloaded
			// Fetch the latest data for each city from the API
			const promises = weatherList.map(async (item) => {
				try {
					const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${item.cityName},${item.country}`)
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
						return {
							...item,
							temperature: data.current.temp_c,
							currCondition: data.current.condition.text,
						}
					} else {
						console.error('Invalid data structure for the city:', data)
						return item // Return the original item if the data is invalid
					}
				} catch (error) {
					console.error('Error:', error)
					return item // Return the original item if there's an error
				}
			})

			try {
				const updatedWeatherList = await Promise.all(promises)

				// Update the state with the latest data
				setWeatherList(updatedWeatherList)

				// Update local storage with the latest temperatures
				localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList))
			} catch (error) {
				console.error('Error updating weather data:', error)
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		window.addEventListener('unload', handleUnload)

		// Remove event listeners on component unmount
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
			window.removeEventListener('unload', handleUnload)
		}
	}, [weatherList])

	useEffect(() => {
		if (weatherData && weatherData.location && weatherData.location.name && weatherData.location.country) {
			addCity()
		} else {
			// console.log('oops')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	//Clear Local Storage
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

	//Fetch from "current" endpoint and pass in id from Search API response
	const getCurrentWeather = async (cityObject: any) => {
		console.log('city object', cityObject)

		console.log(cityItems)
		const alreadyAdded = weatherList.some((weatherItem) => weatherItem.cityName === cityObject.name && weatherItem.country === cityObject.country)
		if (alreadyAdded) {
			timeoutAlreadyAdded()
			setCityItems([])
		} else {
			try {
				const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${cityObject.id}`)

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
				console.log(data)
				return data
			} catch (error) {
				console.error('Error:', error)
			}
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

	//SHOW/HIDE CITY NOT FOUND WARNING
	const timeoutAlreadyAdded = () => {
		setIsAlreadyAdded(true)
		setTimeout(() => {
			setIsAlreadyAdded(false)
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
	}

	//DELETE CITY
	const deleteCity = (id: string) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		return updatedList
	}

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
			Array.isArray(cityItems) && getCurrentWeather(cityItems[activeItem])
			return
		}

		if (Array.isArray(cityItems) && cityItems.length === 1) {
			Array.isArray(cityItems) && getCurrentWeather(cityItems[0])
			return
		}
	}

	//Find existing (filtrerar fram det objekt i weatherList som finns i cityItems-arrayen, dvs. returnerar el-objektet)
	// const checkAlreadyAdded = (weatherList, cityItems) => {
	// 	const alreadyAdded = cityItems.some((cityItem) =>
	// 		weatherList.some((weatherItem) => weatherItem.cityName === cityItem.name && weatherItem.country === cityItem.country)
	// 	)
	// 	if (alreadyAdded) {
	// 		timeoutAlreadyAdded()
	// 		setCityItems([])
	// 		return
	// 	}
	// }

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

			{isAlreadyAdded ? (
				<Popup>
					<div>Staden har redan lagts till</div>
				</Popup>
			) : (
				''
			)}

			<div className={styles.dataresult}>
				{Array.isArray(cityItems) ? (
					cityItems.map((item, i) => (
						<div
							key={i}
							onClick={() => getCurrentWeather(item)}
							className={`${activeItem === i ? `${styles.searchListItem} ${styles.active}` : styles.searchListItem}`}>
							<span>{item?.name} </span>(<span>{item?.country}</span>)
						</div>
					))
				) : (
					<div onClick={() => getCurrentWeather(cityItems)}>
						<span>{cityItems?.name}</span>
						<span>{cityItems?.country}</span>
						<span>{cityItems?.id}</span>
					</div>
				)}
			</div>
			{/* <div>{Array.isArray(cityItems) ? cityItems.map((item, i) => <div key={i}>{item?.name}</div>) : <div>{cityItems?.name}</div>}</div> */}

			<div className={styles.container}>
				{' '}
				{/* Stod weatherData först och då renderades inte local storage förrän jag lagt till en ny stad. Allt rätt
				när ändrade till weatherList */}
				{weatherList &&
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
