/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Popup from '@/components/Popup'
import { formatLocalTime } from '@/utils/dateFormatting'
import { kphTomps } from '@/utils/kphTomps'
import { v4 as uuidv4 } from 'uuid'
import { WeatherAPIResponse, NewWeatherItem, CityItem } from '../types/weatherTypes'
import { fetchWeatherByIp, searchCity, getCurrentWeather } from '../api/weatherApi'
import { getBackgroundImage, timeoutPopup } from '@/utils/weatherUtils'
import WeatherInfo from '@/components/WeatherInfo'

export default function Home() {
	const [enteredCity, setEnteredCity] = useState<string>('')
	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([])

	const [weatherByIp, setWeatherByIp] = useState<WeatherAPIResponse | null>(null)

	const [displayInContentContainer, setDisplayInContentContainer] = useState<NewWeatherItem | null>(
		null
	)

	const [weatherData, setWeatherData] = useState<WeatherAPIResponse | null>(null)
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false)

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1)

	//Already added
	const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false)

	const [isDay, setIsDay] = useState<boolean>(false)

	const fetchWeatherByIpData = async () => {
		try {
			const data = await fetchWeatherByIp()
			setWeatherByIp(data)
		} catch (error) {
			console.error('Error fetching weather by IP:', error)
		}
	}

	//Retrieve from local storage
	useEffect(() => {
		const getInitialData = async () => {
			await fetchWeatherByIpData()
			if (localStorage.length !== 0) {
				const storedItems = localStorage.getItem('weatherList')
				const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
				Array.isArray(storedItemsArray) && setWeatherList(storedItemsArray)
			} else {
				console.log('')
			}
		}
		getInitialData()
	}, [])

	useEffect(() => {
		if (weatherByIp && Object.keys(weatherByIp).length > 0) {
			const newWeatherItem: NewWeatherItem = {
				id: uuidv4(),
				cityName: weatherByIp.location?.name ?? '',
				country: weatherByIp.location?.country ?? '',
				temperature: weatherByIp.current?.temp_c ?? 0,
				currConditionText: weatherByIp.current?.condition?.text ?? '',
				currConditionCode: weatherByIp.current?.condition?.code ?? 0,
				currConditionIcon: weatherByIp.current?.condition?.icon?.startsWith('//')
					? `https:${weatherByIp.current.condition.icon}`
					: weatherByIp.current?.condition?.icon ?? '',
				isDay: weatherByIp.current?.is_day ?? 0,
				localTime: formatLocalTime(weatherByIp.location?.localtime ?? ''),
				feelslike: weatherByIp.current?.feelslike_c ?? 0,
				humidity: weatherByIp.current?.humidity ?? 0,
				cloud: weatherByIp.current?.cloud ?? 0,
				wind: kphTomps(weatherByIp.current?.wind_kph ?? 0),
			}
			setDisplayInContentContainer(newWeatherItem)
		}
		if (isDay) {
			setIsDay(true)
		} else {
			setIsDay(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherByIp])

	useEffect(() => {
		if (weatherList.length !== 0) {
			const updatedWeatherList = weatherList.sort((a, b) =>
				a.temperature && b.temperature ? a.temperature - b.temperature : 0
			)
			setWeatherList(updatedWeatherList)
		}
	}, [weatherList])

	useEffect(() => {
		if (
			weatherData &&
			weatherData.location &&
			weatherData.location.name &&
			weatherData.location.country
		) {
			addCity()
			return
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	const handleOnChange = (value: string) => {
		setEnteredCity(value)
		debounced(value)
	}

	const debounced = useDebouncedCallback((value) => {
		handleSearchCity(value)
	}, 100)

	const handleSearchCity = async (cityName: string) => {
		try {
			const cityData = await searchCity(cityName)
			setCityItems(cityData)
			setActiveItem(0)
			return cityData
		} catch (error) {
			console.error('Error searching city:', error)
		}
	}

	const handleGetCurrentWeather = async (cityObject: any) => {
		const alreadyAdded = weatherList.some(
			(weatherItem) =>
				weatherItem.cityName === cityObject.name && weatherItem.country === cityObject.country
		)
		if (alreadyAdded) {
			timeoutAlreadyAdded()
			setCityItems([])
		} else {
			try {
				const data = await getCurrentWeather(cityObject.id)

				if (
					data &&
					data.location &&
					data.location.name &&
					data.location.country &&
					data.current &&
					data.current.temp_c !== undefined &&
					data.current.temp_c !== null &&
					data.current.condition &&
					data.current.condition.text &&
					data.current.condition.icon &&
					data.current.condition.code &&
					data.current.is_day !== undefined &&
					data.current.is_day !== null
				) {
					setWeatherData(data)
					setEnteredCity('')
					setCityItems([])
				} else {
					console.error('Error:', data)
				}
				if (data.current.is_day) {
					setIsDay(true)
				} else {
					setIsDay(false)
				}

				return data
			} catch (error) {
				console.error('Error:', error)
			}
		}
	}

	//City not found popup
	const timeoutCityNotFoundString = () => {
		timeoutPopup(setIsCityNotFound)
		setEnteredCity('')
	}

	//Empty input popup
	const timeoutNoInput = () => {
		timeoutPopup(setIsInputEmpty)
		setEnteredCity('')
	}

	//Already added popup
	const timeoutAlreadyAdded = () => {
		timeoutPopup(setIsAlreadyAdded)
		setEnteredCity('')
	}

	//Add city
	const addCity = () => {
		if (!weatherData || !weatherData.location || !weatherData.current) return

		const newWeatherItem: NewWeatherItem = {
			id: uuidv4(),
			cityName: weatherData.location.name ?? '',
			country: weatherData.location.country ?? '',
			temperature: weatherData.current.temp_c ?? 0,
			currConditionText: weatherData.current.condition?.text ?? '',
			currConditionCode: weatherData.current.condition?.code ?? 0,
			currConditionIcon: weatherData.current.condition?.icon?.startsWith('//')
				? `https:${weatherData.current.condition.icon}`
				: weatherData.current.condition?.icon ?? '',
			isDay: weatherData.current.is_day ?? 0,
			localTime: formatLocalTime(weatherData.location.localtime ?? ''),
			feelslike: weatherData.current.feelslike_c ?? 0,
			humidity: weatherData.current.humidity ?? 0,
			cloud: weatherData.current.cloud ?? 0,
			wind: kphTomps(weatherData.current.wind_kph ?? 0),
		}

		//Update local storage after adding new item
		const updatedWeatherList: NewWeatherItem[] = [...weatherList, newWeatherItem]

		setWeatherList(updatedWeatherList)

		localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList))
		setDisplayInContentContainer(newWeatherItem)
	}

	//Delete city
	const deleteCity = (id: string | undefined) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		//Update local storage after deleting an item
		localStorage.setItem('weatherList', JSON.stringify(updatedList))
		return updatedList
	}

	//Handle key navigation (arrows & enter)
	const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowDown':
				Array.isArray(cityItems) &&
					activeItem < cityItems.length - 1 &&
					setActiveItem((prev) => prev + 1)
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
		const cityFound =
			Array.isArray(cityItems) &&
			cityItems.some((item) => item.name?.toLowerCase().includes(enteredCity.toLowerCase()))

		if (!enteredCity) {
			timeoutNoInput()
			return
		}

		if (!cityFound) {
			timeoutCityNotFoundString()
			return
		}

		if (activeItem >= 0) {
			Array.isArray(cityItems) && handleGetCurrentWeather(cityItems[activeItem])
			return
		}

		if (Array.isArray(cityItems) && cityItems.length === 1) {
			Array.isArray(cityItems) && handleGetCurrentWeather(cityItems[0])
			return
		}
	}

	const clearLocalStorage = () => {
		localStorage.clear()
		setWeatherList([])
	}

	let backgroundImage = getBackgroundImage(
		isDay,
		weatherData?.current?.condition?.code ?? undefined
	)

	return (
		<main
			className={styles.main}
			style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
			<section className={styles.container}>
				<WeatherInfo displayInContentContainer={displayInContentContainer} />
			</section>

			<aside className={styles.sidePanel}>
				<div className={styles.inputContainer}>
					<div>
						<input
							className={styles.inputField}
							type='text'
							id='search'
							onChange={(e) => handleOnChange(e.target.value)}
							value={enteredCity}
							autoComplete='off'
							onKeyDown={(e) => handleKeyNavigation(e)}
							spellCheck='false'
							placeholder='Search City...'
						/>
					</div>

					{isCityNotFound ? (
						<Popup>
							<div>No city found matching your search.</div>
						</Popup>
					) : (
						''
					)}

					{isInputEmpty ? (
						<Popup>
							<div>Enter a city.</div>
						</Popup>
					) : (
						''
					)}

					{isAlreadyAdded ? (
						<Popup>
							<div>City already added.</div>
						</Popup>
					) : (
						''
					)}

					<motion.div className={styles.dataresult}>
						{Array.isArray(cityItems) ? (
							cityItems.map((item, i) => (
								<motion.div
									onClick={() => handleGetCurrentWeather(item)}
									initial={{ opacity: 0, y: 0 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									key={i}
									className={`${activeItem === i ? `${styles.searchListItem} ${styles.active}` : styles.searchListItem}`}>
									<span>{item?.name} </span>(<span>{item?.country}</span>)
								</motion.div>
							))
						) : (
							<motion.div
								onClick={() => handleGetCurrentWeather(cityItems)}
								initial={{ opacity: 0, y: 0 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.5, delay: 0.1 }}>
								<span>{cityItems?.name}</span>
								<span>{cityItems?.country}</span>
								<span>{cityItems?.id}</span>
							</motion.div>
						)}
					</motion.div>
				</div>

				<div className={styles.sidePanelCards}>
					<div className={styles.delAllBtnContainer}>
						<button onClick={clearLocalStorage} className={styles.delAllBtn}>
							Delete All Previous
						</button>
					</div>

					{weatherList &&
						weatherList.map((item, i) => {
							return (
								<div key={i} className={styles.weatherCardContainer}>
									{
										<WeatherCard
											cityName={item.cityName}
											temperature={item.temperature}
											currConditionText={item.currConditionText}
											country={item.country}
											isDay={item.isDay}
											deleteCity={() => deleteCity(item.id)}
											feelslike={item.feelslike}
											localTime={item.localTime}
											humidity={item.humidity}
											cloud={item.cloud}
											wind={item.wind}
										/>
									}
								</div>
							)
						})}
				</div>
			</aside>
		</main>
	)
}
