'use client'
import sun from '../../public/bgImages/day/sun.jpg'
import sunnyIcon from '../../public/icons/day/113.png'
import { motion } from 'framer-motion'
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
		is_day: number
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
	isDay?: number
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
	}
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

	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false)

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1)

	//Already added
	const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false)

	const [bannerCities, setBannerCities] = useState<null | BannerCity[]>([])

	//RETRIEVE FROM LOCAL STORAGE
	//När jag körde Array.isArray(storedItemsArray) i stället för att först sätta setWeatherList(storedItemsArray) följt av
	//Array.isArray(weatherList) så fick jag plötsligt ut items med console.log(storedItemsArray).
	useEffect(() => {
		const storedItems = localStorage.getItem('weatherList')
		const storedItemsArray = storedItems ? JSON.parse(storedItems) : []
		Array.isArray(storedItemsArray) &&
			weatherList.forEach((item) => {
				getCurrentWeather(item.id)
			})
		setWeatherList(storedItemsArray)
		console.log('Stored Items Array', storedItemsArray)
	}, [])

	//Add weatherList array to local storage
	useEffect(() => {
		if (weatherList.length !== 0) {
			const updatedWeatherList = weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0))
			setWeatherList(updatedWeatherList)
			console.log('Weather List', weatherList)
			// localStorage.setItem('weatherList', JSON.stringify(weatherList))
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
			addCity()
		} else {
			// console.log('oops')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	// //Clear Local Storage
	// const clearLocalStorage = () => {
	// 	localStorage.clear()
	// }

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
					data.current.is_day !== undefined &&
					data.current.is_day !== null
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
			id: new Date().getTime().toString(),
			cityName: weatherData?.location.name,
			country: weatherData?.location.country,
			temperature: weatherData?.current.temp_c,
			currCondition: weatherData?.current.condition.text,
			isDay: weatherData?.current.is_day,
		}

		//Update local storage after adding new item
		const updatedWeatherList = [...weatherList, newWeatherItem]
		setWeatherList(updatedWeatherList)
		localStorage.setItem('weatherList', JSON.stringify(weatherList))
	}

	//DELETE CITY
	const deleteCity = (id: string) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		//Update local storage after deleting an item
		localStorage.setItem('weatherList', JSON.stringify(updatedList))
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

	//Clear Local Storage
	const clearLocalStorage = () => {
		localStorage.clear()
	}

	const bannerVariants = {
		animate: {
			y: ['-10vh', '1.5vh'],
			transition: {
				y: {
					// repeat: Infinity,
					repeatType: 'loop',
					duration: 2,
					ease: 'linear',
				},
			},
		},
	}

	const dropDownVariants = {
		animate: {
			opacity: [0, 1],
			transition: {
				when: 'beforeChildren',
				staggerChildren: 0.5,
			},
		},
	}

	const dropDownVariantsChildren = {
		initial: { opacity: 0, y: -10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	}

	// const parentVariants = {
	// 	animate: {
	// 		y: ['-10vh', '2vh'],
	// 		opacity: 1,
	// 		transition: {
	// 			when: 'beforeChildren',
	// 			staggerChildren: 0.5,
	// 		},
	// 	},
	// 	exit: { opacity: 0 }, // Remove transition property from exit
	// }

	// const childrenVariants = {
	// 	// initial: { y: -20, opacity: 0 },
	// 	// animate: { y: 0, opacity: 1, transition: { duration: 2 } },
	// 	transition: {
	// 		y: {
	// 			repeat: Infinity,
	// 			repeatType: 'loop',
	// 			duration: 3,
	// 			ease: 'linear',
	// 		},
	// 	},
	// }

	return (
		<main className={styles.appWrapper}>
			<section className={styles.container}>
				<header className={styles.bannerContainer}>
					<div className={styles.bannerItems}>
						{bannerCities?.map((city, i) => (
							<motion.div key={i} className={styles.bannerCity} variants={bannerVariants} animate='animate' exit='exit'>
								<div className={styles.bannerCityName}>{city.location.name}&nbsp;</div>
								<div className={styles.bannerCityTemp}>{city.current.temp_c}°C</div>
								<img
									src={city.current.condition.icon}
									width={30}
									height={30}
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
						<h1 className={styles.temp}>16&#176;</h1>

						<div>
							<h1 className={styles.cityName}>London</h1>
							<small>
								<span className={styles.localTime}>07:09 </span>
								<span className={styles.date}>Monday Sept 10</span>
							</small>
						</div>

						<div>
							<Image src={sunnyIcon} width={50} height={50} alt={`Weather icon for London`} className={styles.icon} />
							<div className={styles.weatherDescription}>Cloudy</div>
						</div>

						<ul className={styles.weatherDetails}>
							<li className={styles.humidity}>
								<span>Humidity:</span> <span>85%</span>
							</li>
							<li className={styles.cloud}>
								<span>Cloud:</span> <span>89%</span>
							</li>
							<li className={styles.wind}>
								<span>Wind:</span> <span>8 km/h</span>
							</li>
						</ul>
					</div>
				</section>
			</section>
			<aside className={styles.sidePanel}>
				<div className={styles.sidePanelHeader}>
					{/* <div>
						<label htmlFor='checkbox' className={styles.labelModeCheckbox}>
							Toggle dark/light mode
						</label>
						<input name='checkbox' type='checkbox' className={styles.checkbox} />
					</div> */}

					<Image src={logoAlster} height={25} width={25} alt='Alster logo' className={styles.logoAlster} />
				</div>
				<div className={styles.inputContainer}>
					<div>
						{/* <label className={styles.label} htmlFor='search'>
							City:
						</label> */}

						<input
							className={styles.inputField}
							type='text'
							id='search'
							onChange={(e) => handleOnChange(e.target.value)}
							value={enteredCity}
							autoComplete='off'
							onKeyDown={(e) => handleKeyNavigation(e)}
							spellcheck='false'
							placeholder='Search City...'
						/>
					</div>

					{isCityNotFound ? (
						<Popup>
							<div>Det finns ingen stad som matchar din sökning</div>
						</Popup>
					) : (
						''
					)}

					{isInputEmpty ? (
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

					<motion.div className={styles.dataresult}>
						{Array.isArray(cityItems) ? (
							cityItems.map((item, i) => (
								<motion.div
									onClick={() => getCurrentWeather(item)}
									initial={{ opacity: 0, y: -10 }}
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
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.5, delay: 0.1 }}>
								<span>{cityItems?.name}</span>
								<span>{cityItems?.country}</span>
								<span>{cityItems?.id}</span>
							</motion.div>
						)}
					</motion.div>
					{/* <div>{Array.isArray(cityItems) ? cityItems.map((item, i) => <div key={i}>{item?.name}</div>) : <div>{cityItems?.name}</div>}</div> */}
				</div>

				<div className={styles.sidePanelCards}>
					<div className={styles.delAllBtnContainer}>
						<button onClick={clearLocalStorage} className={styles.delAllBtn}>
							Delete All Saved
						</button>
					</div>
					{/* Stod weatherData först och då renderades inte local storage förrän jag lagt till en ny stad. Allt rätt
				               när ändrade till weatherList */}
					{weatherList &&
						weatherList.map((item, i) => {
							let bgDaySnowy = item.isDay && item.isDay === 1 && item.currCondition && item.currCondition?.toLowerCase().includes('snow')
							return (
								<div key={i}>
									{
										<WeatherCard
											cityName={item.cityName}
											temperature={item.temperature}
											currCondition={item.currCondition}
											country={item.country}
											isDay={item.isDay}
											deleteCity={() => deleteCity(item.id)}
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
