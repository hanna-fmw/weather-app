'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Popup from '@/components/Popup'
<<<<<<< HEAD
import Navbar from '@/components/Navbar'
=======
import { formatLocalTime } from './utils/dateFormatting'
import { kphTomps } from './utils/kphTomps'
import { v4 as uuidv4 } from 'uuid'
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b

const apiKey = process.env.NEXT_PUBLIC_API_KEY

type WeatherData = {
	location: {
		name: string
		country: string
		localtime: string
	}
	current: {
		temp_c: number
		is_day: number
		feelslike_c: number
		humidity: number
		cloud: number
		wind_kph: number
		condition: {
			text: string
			icon: string
			code: number
		}
	}
}

type NewWeatherItem = {
	id?: string
	cityName?: string
	temperature?: number
	currConditionText?: string
	currConditionCode?: number
	currConditionIcon?: string
	country?: string
	isDay?: number
	localTime?: string
	feelslike?: number
	humidity?: number
	cloud?: number
	wind?: number
}

type CityItem = {
	id?: number
	name?: string
	country?: string
}

type BannerCity = {
	location: {
		name: string
		country: string
	}
	current: {
		temp_c: number
		condition: {
			text: string
			icon: string
		}
<<<<<<< HEAD
	}
}

const searchCity = async (cityName: string) => {
	try {
		const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`)
		const cityData = await res.json()
		return cityData
	} catch (error) {
		console.error('Error:', error)
=======
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	}
}

// type CityByIp = {
// 	location: {
// 		name: string
// 		country: string
// 		localtime: string
// 	}
// 	current: {
// 		temp_c: number
// 		is_day: number
// 		feelslike_c: number
// 		humidity: number
// 		cloud: number
// 		wind_kph: number
// 		condition: {
// 			text: string
// 			icon: string
// 			code: number
// 		}
// 	}
// }

export default function Home() {
	const [enteredCity, setEnteredCity] = useState<string>('')
	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([])

	//eftersom en fetch så kan den vara null
	const [weatherByIp, setWeatherByIp] = useState<WeatherData | null>(null)

	const [displayInContentContainer, setDisplayInContentContainer] = useState<NewWeatherItem>(weatherByIp)

	const [weatherData, setWeatherData] = useState<null | WeatherData>(null)
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false)

	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false)

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1)

	//Already added
	const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false)

	const [bannerCities, setBannerCities] = useState<null | BannerCity[]>([])

<<<<<<< HEAD
=======
	const [isDay, setIsDay] = useState<boolean>(false)

	const fetchWeatherByIp = async () => {
		const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`)
		const data = await res.json()
		console.log('detta är info från ip lookup api', data)

		setWeatherByIp(data)

		// if (data.current.is_day) {
		// 	console.log('day day day', data.current.is_day)
		// 	setIsDay(true)
		// } else {
		// 	setIsDay(false)
		// }
	}

	// const fetchWeatherByIp = async () => {
	// 	try {
	// 		const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`)
	// 		const data = await res.json()
	// 		console.log('detta är info från ip lookup api', data)
	// 		if (
	// 			data &&
	// 			data.location &&
	// 			data.location.name &&
	// 			data.location.country &&
	// 			data.current &&
	// 			data.current.temp_c !== undefined &&
	// 			data.current.temp_c !== null &&
	// 			data.current.condition &&
	// 			data.current.condition.text &&
	// 			data.current.condition.icon &&
	// 			data.current.condition.cod &&
	// 			data.current.is_day !== undefined &&
	// 			data.current.is_day !== null
	// 		) {
	// 			setWeatherByIp(data)
	// 		}

	// 		if (data.current.is_day) {
	// 			console.log('day day day', data.current.is_day)
	// 			setIsDay(true)
	// 		} else {
	// 			setIsDay(false)
	// 		}
	// 	} catch (error) {
	// 		console.error('Error', error)
	// 	}
	// }

>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	//RETRIEVE FROM LOCAL STORAGE
	//När jag körde Array.isArray(storedItemsArray) i stället för att först sätta setWeatherList(storedItemsArray) följt av
	//Array.isArray(weatherList) så fick jag plötsligt ut items med console.log(storedItemsArray).
	useEffect(() => {
<<<<<<< HEAD
		const storedItems = localStorage.getItem('weatherList')
		const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
		Array.isArray(storedItemsArray) &&
			weatherList.forEach((item) => {
				getCurrentWeather(item.id)
			})
		setWeatherList(storedItemsArray)
		console.log('Stored Items Array', storedItemsArray)
=======
		const getInitialData = async () => {
			console.log('hellooooooo')
			//fetchWeatherByIp är async så då måste vi awaita den här:
			await fetchWeatherByIp()
			if (localStorage.length !== 0) {
				const storedItems = localStorage.getItem('weatherList')
				const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
				Array.isArray(storedItemsArray) && setWeatherList(storedItemsArray)
				console.log('Stored Items Array', storedItemsArray)
			} else {
				console.log('')
			}
		}
		getInitialData()
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	}, [])

	useEffect(() => {
		// Check if weatherByIp finns och har properties och set it as the initial content
		if (weatherByIp && Object.keys(weatherByIp).length > 0) {
			setDisplayInContentContainer({
				id: uuidv4(),
				cityName: weatherByIp.location.name,
				country: weatherByIp.location.country,
				temperature: weatherByIp.current.temp_c,
				currConditionText: weatherByIp.current.condition.text,
				currConditionCode: weatherByIp.current.condition.code,
				currConditionIcon: weatherByIp.current.condition.icon,
				isDay: weatherByIp.current.is_day,
				localTime: formatLocalTime(weatherByIp.location.localtime),
				feelslike: weatherByIp.current.feelslike_c,
				humidity: weatherByIp.current.humidity,
				cloud: weatherByIp.current.cloud,
				wind: parseFloat(kphTomps(weatherByIp.current.wind_kph)),
			})
		}
		if (isDay) {
			setIsDay(true)
		} else {
			setIsDay(false)
		}
	}, [weatherByIp])

	//Add weatherList array to local storage
	useEffect(() => {
		if (weatherList.length !== 0) {
			const updatedWeatherList = weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0))
			setWeatherList(updatedWeatherList)
<<<<<<< HEAD
			console.log('Weather List', weatherList)
			// localStorage.setItem('weatherList', JSON.stringify(weatherList))
=======
			console.log('Weather list:', weatherList)
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
		}
	}, [weatherList])

	// // Add event listener for beforeunload and unload
	// useEffect(() => {
	// 	const handleBeforeUnload = () => {
	// 		// Update local storage with the latest temperatures
	// 		localStorage.setItem('weatherList', JSON.stringify(weatherList))
	// 	}

	// 	const handleUnload = async () => {
	// 		// Retrieve the latest data before the page is unloaded
	// 		// Fetch the latest data for each city from the API
	// 		const promises = weatherList.map(async (item) => {
	// 			try {
	// 				const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${item.cityName},${item.country}`)
	// 				const data = await res.json()

	// 				if (
	// 					data &&
	// 					data.location &&
	// 					data.location.name &&
	// 					data.location.country &&
	// 					data.current &&
	// 					data.current.temp_c !== undefined &&
	// 					data.current.temp_c !== null &&
	// 					data.current.condition &&
	// 					data.current.condition.text
	// 				) {
	// 					return {
	// 						...item,
	// 						temperature: data.current.temp_c,
	// 						currCondition: data.current.condition.text,
	// 					}
	// 				} else {
	// 					console.error('Invalid data structure for the city:', data)
	// 					return item // Return the original item if the data is invalid
	// 				}
	// 			} catch (error) {
	// 				console.error('Error:', error)
	// 				return item // Return the original item if there's an error
	// 			}
	// 		})

	// 		try {
	// 			const updatedWeatherList = await Promise.all(promises)

	// 			// Update the state with the latest data
	// 			setWeatherList(updatedWeatherList)

	// 			// Update local storage with the latest temperatures
	// 			localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList))
	// 		} catch (error) {
	// 			console.error('Error updating weather data:', error)
	// 		}
	// 	}

	// 	window.addEventListener('beforeunload', handleBeforeUnload)
	// 	window.addEventListener('unload', handleUnload)

	// 	// Remove event listeners on component unmount
	// 	return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload)
	// 		window.removeEventListener('unload', handleUnload)
	// 	}
	// }, [weatherList])

	useEffect(() => {
		if (weatherData && weatherData.location && weatherData.location.name && weatherData.location.country) {
			console.log('Weather data:', weatherData)
			addCity()
			// addCityToContentContainer()
			return
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

<<<<<<< HEAD
	// //Clear Local Storage
	// const clearLocalStorage = () => {
	// 	localStorage.clear()
	// }

=======
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	const handleOnChange = (value: string) => {
		setEnteredCity(value)
		debounced(value)
	}

	const debounced = useDebouncedCallback((value) => {
		searchCity(value)
	}, 100)

	const searchCity = async (cityName: string) => {
		try {
			const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`)
			const cityData = await res.json()
			setCityItems(cityData)
			setActiveItem(0)
			console.log('City items list', cityItems)
			return cityData
		} catch (error) {
			console.error('Error:', error)
		}
	}

	//Fetch from "current" endpoint and pass in id from Search API response
	const getCurrentWeather = async (cityObject: any) => {
		console.log('city object', cityObject)

		console.log('cityItems', cityItems)
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

				console.log('Weather Data', weatherData)

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
		setIsInputEmpty(true)
		setTimeout(() => {
			setIsInputEmpty(false)
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
			id: uuidv4(),
			cityName: weatherData?.location.name,
			country: weatherData?.location.country,
			temperature: weatherData?.current.temp_c,
			currConditionText: weatherData?.current.condition.text,
			currConditionCode: weatherData?.current.condition.code,
			currConditionIcon: weatherData?.current.condition.icon,
			isDay: weatherData?.current.is_day,
			localTime: formatLocalTime(weatherData?.location.localtime),
			feelslike: weatherData?.current.feelslike_c,
			humidity: weatherData?.current.humidity,
			cloud: weatherData?.current.cloud,
			wind: kphTomps(weatherData?.current.wind_kph),
		}

		//Update local storage after adding new item
		const updatedWeatherList = [...weatherList, newWeatherItem]
		setWeatherList(updatedWeatherList)
<<<<<<< HEAD
		localStorage.setItem('weatherList', JSON.stringify(weatherList))
=======
		// localStorage.setItem('weatherList', JSON.stringify(weatherList))
		localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList))
		setDisplayInContentContainer(newWeatherItem)
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	}

	// const addCityToContentContainer = () => {
	// 	const newWeatherItem = {
	// 		id: uuidv4(),
	// 		cityName: weatherData?.location.name,
	// 		country: weatherData?.location.country,
	// 		temperature: weatherData?.current.temp_c,
	// 		currConditionText: weatherData?.current.condition.text,
	// 		currConditionCode: weatherData?.current.condition.code,
	// 		currConditionIcon: weatherData?.current.condition.icon,
	// 		isDay: weatherData?.current.is_day,
	// 		localTime: formatLocalTime(weatherData?.location.localtime),
	// 		feelslike: weatherData?.current.feelslike_c,
	// 		humidity: weatherData?.current.humidity,
	// 		cloud: weatherData?.current.cloud,
	// 		wind: kphTomps(weatherData?.current.wind_kph),
	// 	}

	// 	//Save to variable for displaying in content container without saving to local storage
	// 	setDisplayInContentContainer(newWeatherItem)
	// 	console.log('detta är displayContentContainer', displayInContentContainer)
	// }

	//DELETE CITY
	const deleteCity = (id: string | undefined) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		//Update local storage after deleting an item
		localStorage.setItem('weatherList', JSON.stringify(updatedList))
		return updatedList
	}

	//HANDLE KEY NAVIGATION (ARROWS & ENTER)
	//Array.isArray(cityItems) to check that this is an array (to avoid "some is not a function" error)
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

	const animatedBannerCities = [
		{ id: '2618724', name: 'New York' },
		{ id: '2280360', name: 'Stockholm' },
		{ id: '3125553', name: 'Tokyo' },
		{ id: '714482', name: 'Madrid' },
		{ id: '2267741', name: 'Järvsö' },
	]

	useEffect(() => {
		const getBannerCities = async () => {
			try {
				const promises = animatedBannerCities.map(async (bannerCity) => {
					const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${bannerCity.id}`)
					//Stockholm: 2280360
					//9ec16cfb15ce4a1e88484621232211
					const data = await res.json()

					return { ...data, city: bannerCity.name }
				})

				const bannerCityResults = await Promise.all(promises)
				setBannerCities(bannerCityResults)
			} catch (error) {
				console.error('Error:', error)
			}
		}
		getBannerCities()
	}, [])

<<<<<<< HEAD
	const marqueeVariants = {
		animate: {
			x: ['0%', '100%'],
			transition: {
				x: {
					repeat: Infinity,
					repeatType: 'loop',
					duration: 10,
=======
	//Clear Local Storage
	const clearLocalStorage = () => {
		localStorage.clear()
		setWeatherList([])
	}

	const bannerVariants = {
		animate: {
			y: ['-10vh', '1.5vh'],
			transition: {
				y: {
					repeatType: 'loop',
					duration: 2,
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
					ease: 'linear',
				},
			},
		},
	}
<<<<<<< HEAD

	return (
		<>
			<footer className={styles.footer}>
				{/* <Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} /> */}

				<motion.div className={styles.bannerContainer} variants={marqueeVariants} animate='animate'>
					{bannerCities?.map((city, i) => (
						<div key={i} className={styles.bannerCity}>
							<div>{city.location.name}&nbsp;</div>
							<div>{city.current.temp_c}°C</div>
							<img src={city.current.condition.icon} alt={`Weather icon for ${city.location.name}`} />
						</div>
					))}
				</motion.div>
			</footer>
			<main className={styles.main}>
				{/* <div className={styles.header}>
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
			</div> */}
				<section className={styles.layout}>
					<div className={styles.inputContainer}>
						<label className={styles.label} htmlFor='search'>
							City:
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
=======

	const getBackgroundImage = (isDay: boolean) => {
		let timeOfDay = isDay ? 'day' : 'night'
		const code = weatherData?.current.condition.code

		switch (timeOfDay) {
			case 'day':
				switch (code) {
					case 1000:
						return '/bgImages/day/sun.jpg'
						break
					case 1003:
						return '/bgImages/day/cloud.jpg'
						break
					case 1006:
						return '/bgImages/day/cloud.jpg'
						break
					case 1009:
						return '/bgImages/day/cloud.jpg'
						break
					case 1030:
					case 1135:
						return '/bgImages/day/mist.jpg'
						break
					case 1063:
					case 1150:
					case 1153:
					case 1180:
					case 1183:
					case 1186:
					case 1189:
					case 1192:
					case 1195:
					case 1198:
					case 1201:
					case 1204:
					case 1207:
					case 1240:
					case 1243:
					case 1246:
					case 1249:
					case 1252:
						return '/bgImages/day/rain.jpg'
						break

					case 1066:
					case 1069:
					case 1072:
					case 1114:
					case 1117:
					case 1147:
					case 1168:
					case 1171:
					case 1210:
					case 1213:
					case 1216:
					case 1219:
					case 1222:
					case 1225:
					case 1237:
					case 1255:
					case 1258:
					case 1261:
					case 1264:
					case 1279:
					case 1282:
						return '/bgImages/day/snow.jpg'
						break

					case 1087:
					case 1273:
					case 1276:
						return '/bgImages/day/thunder.jpg'
						break
					default:
						return '/bgImages/day/cloud.jpg'
				}
			case 'night':
				switch (code) {
					case 1000:
						return '/bgImages/night/night-clear-sky.jpg'
					case 1003:
						return '/bgImages/night/night-cloud.jpg'
					case 1006:
						return '/bgImages/night/night-cloud.jpg'
					case 1009:
						return '/bgImages/night/night-cloud.jpg'

					case 1030:
					case 1135:
						return '/bgImages/night/night-mist.jpg'
						break
					case 1063:
					case 1150:
					case 1153:
					case 1180:
					case 1183:
					case 1186:
					case 1189:
					case 1192:
					case 1195:
					case 1198:
					case 1201:
					case 1204:
					case 1207:
					case 1240:
					case 1243:
					case 1246:
					case 1249:
					case 1252:
						return '/bgImages/night/night-rain.jpg'
						break

					case 1066:
					case 1069:
					case 1072:
					case 1114:
					case 1117:
					case 1147:
					case 1168:
					case 1171:
					case 1210:
					case 1213:
					case 1216:
					case 1219:
					case 1222:
					case 1225:
					case 1237:
					case 1255:
					case 1258:
					case 1261:
					case 1264:
					case 1279:
					case 1282:
						return '/bgImages/night/night-snow.jpg'
						break

					case 1087:
					case 1273:
					case 1276:
						return '/bgImages/night/night-thunder.jpg'
						break
					default:
						return '/bgImages/night/night-cloud.jpg'
				}
		}
	}

	let backgroundImage = getBackgroundImage(isDay)
	// let backgroundImage = getBackgroundImage(isDay) || '/bgImages/day/cloud.jpg'

	return (
		<main className={styles.appWrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
			<section className={styles.container}>
				<header className={styles.bannerContainer}>
					<div className={styles.bannerItems}>
						{bannerCities?.map((city, i) => (
							<motion.div key={i} className={styles.bannerCity} variants={bannerVariants} animate='animate' exit='exit'>
								<div className={styles.bannerCityName}>{city.location.name}&nbsp;</div>
								<div className={styles.bannerCityTemp}>{city.current.temp_c}°C</div>
								<img
									src={city.current.condition.icon}
									width={40}
									height={40}
									alt={`Weather icon for ${city.location.name}`}
									className={styles.bannerIcon}
								/>
								{/* <Image src={city.current.condition.icon} width={30} height={30} alt={`Weather icon for ${city.location.name}`} /> */}
							</motion.div>
						))}
					</div>
				</header>

				<section className={styles.contentContainer}>
					<div className={styles.cityDetails}>
						<div className={styles.cityTemp}>
							<h1 className={styles.temp}>{displayInContentContainer?.temperature?.toFixed(1)}&#176;</h1>

							<h1 className={styles.cityName}>{displayInContentContainer?.cityName}</h1>

							<small>
								<span className={styles.localTime}>{displayInContentContainer?.localTime}</span>
							</small>
						</div>

						<div>
							<div className={styles.weatherDescription}>{displayInContentContainer?.currConditionText}</div>

							<img src={displayInContentContainer?.currConditionIcon} width={40} height={40} className={styles.bannerIcon} alt='Weather icon' />

							<ul className={styles.weatherDetails}>
								<li className={styles.feelslike}>
									<span>Feels like:</span> <span>{displayInContentContainer?.feelslike?.toFixed(1)}&#176;</span>
								</li>
								<li className={styles.humidity}>
									<span>Humidity:</span> <span>{displayInContentContainer?.humidity}%</span>
								</li>
								<li className={styles.cloud}>
									<span>Cloud:</span> <span>{displayInContentContainer?.cloud}%</span>
								</li>
								<li className={styles.wind}>
									<span>Wind:</span> <span>{displayInContentContainer?.wind}m/s</span>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</section>
			<aside className={styles.sidePanel}>
				<div className={styles.sidePanelHeader}>
					<Image src={logoAlster} height={25} width={25} alt='Alster logo' className={styles.logoAlster} />
				</div>
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
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
						</Popup>
					) : (
						''
					)}

<<<<<<< HEAD
					{inputFieldEmptyPopup ? (
						<Popup>
							<div>Du måste ange en stad</div>
=======
					{isInputEmpty ? (
						<Popup>
							<div>Enter a city.</div>
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
						</Popup>
					) : (
						''
					)}

					{isAlreadyAdded ? (
						<Popup>
<<<<<<< HEAD
							<div>Staden har redan lagts till</div>
=======
							<div>City already added.</div>
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
						</Popup>
					) : (
						''
					)}

<<<<<<< HEAD
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
						{/* Stod weatherData först och då renderades inte local storage förrän jag lagt till en ny stad. Allt rätt
				när ändrade till weatherList */}
						{weatherList &&
							weatherList.map((item, i) => {
								return (
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
								)
							})}
					</div>
				</section>
				<section className={styles.nav}>
					<Navbar />
				</section>
			</main>
		</>
=======
					<motion.div className={styles.dataresult}>
						{Array.isArray(cityItems) ? (
							cityItems.map((item, i) => (
								<motion.div
									onClick={() => getCurrentWeather(item)}
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
								onClick={() => getCurrentWeather(cityItems)}
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
					{/* Stod weatherData först och då renderades inte local storage förrän jag lagt till en ny stad. Allt rätt
				               när ändrade till weatherList */}
					{weatherList &&
						weatherList.map((item, i) => {
							return (
								<div key={i}>
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
>>>>>>> a9c3d6ecdbef7eca2202ada0e72862e52c18a71b
	)
}
