'use client'
import Image from 'next/image'
import styles from './page.module.css'
import './globals.css'
import WeatherCard from '@/components/WeatherCard'
import logoAlster from '../../public/logoAlster.png'
import React, { useState, useEffect } from 'react'
// import plusSign from '../../public/plusSign.png'
import { useDebouncedCallback } from 'use-debounce'

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
		//1. Använda Search API för att hitta alla träffar på input-namnet (detta
		//görs vid input i input-fältet, dvs. renderar lista med alla namn som påträffas vid onChange):
		const res = await fetch(`http://api.weatherapi.com/v1/search.json?key=9ec16cfb15ce4a1e88484621232211&q=${cityName}`)
		//Response:
		//[
		// 	{
		// 		"id": 2801268,
		// 		"name": "London",
		// 		"region": "City of London, Greater London",
		// 		"country": "United Kingdom",
		// 		"lat": 51.52,
		// 		"lon": -0.11,
		// 		"url": "london-city-of-london-greater-london-united-kingdom"
		// 	},
		// 	{
		// 		"id": 315398,
		// 		"name": "London",
		// 		"region": "Ontario",
		// 		"country": "Canada",
		// 		"lat": 42.98,
		// 		"lon": -81.25,
		// 		"url": "london-ontario-canada"
		// 	}
		// ]

		//2. Ta id:t som search-fetchen ovan returnerar (search returnerar array av location-objekt med bla namn och id) och lägg
		//in det i fetchen mot Current API:et (nedan) som körs vid onClick (funktionen getCurrentWeather) på något av namnen som returneras av Search API. Dvs.
		//flytta fetchen nedan så att den kör med q=id:t från search-resultatet i stället för cityName. Lägg in denna fettch i
		//onClick funktionen (och on click körs när användaren väljer något av resultaten som renderas av search-fetchen ovan)
		// const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`)
		//const data = await res.json()
		// 	return data
		// } catch (error) {
		// 	console.error('Error:', error)
		// }

		//Det är bara med search API som returen är en array av location
		// http://api.weatherapi.com/v1/search.json?key=9ec16cfb15ce4a1e88484621232211&q=London
		//http://api.weatherapi.com/v1/current.json?key=9ec16cfb15ce4a1e88484621232211&q=Paris
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

	//Search API returnerar cityData som är en array av objekt med info om staden som sökts (q=Stockholm)
	//[
	// {
	// 	"id": 2280360,
	// 	"name": "Stockholm",
	// 	"region": "Stockholms Lan",
	// 	"country": "Sweden",
	// 	"lat": 59.33,
	// 	"lon": 18.05,
	// 	"url": "stockholm-stockholms-lan-sweden"
	// 	}
	// 	]
	// const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([])

	const [cityItems, setCityItems] = useState<CityItem[]>([])

	//För att keep track of piltangenterna
	const [activeItem, setActiveItem] = useState(-1)

	// const getWeatherList = JSON.parse(localStorage.getItem('weatherItemAdded'))
	useEffect(() => {
		// clearTimeout(delayInputTimeoutId)

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

		if (weatherData && weatherData.location && weatherData.location.name && weatherData.location.country) {
			addCity()
		} else {
			setIsCityNotFound(true)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData])

	const handleOnChange = (value: string) => {
		setEnteredCity(value)
		debounced(value)
	}

	const debounced = useDebouncedCallback((value) => {
		triggerSearch()
	}, 100)

	//Försökte lägga från const searchedCity (dvs. bara själva funktionsdefinitionen) inuti handleOnChange -
	// ISTÄLLET FÖR ATT KÖRA FUNKTIONEN INUTI ONCHANGE!!!
	const triggerSearch = async () => {
		const searchedCity = await searchCity(enteredCity)
		setCityItems(searchedCity)
	}

	//In i denna måste jag trycka in som parameter (och inuti fetch-URL:en) det id somvi fick från search API (q=id:12345), och
	//detta id måste jag också skicka in som argument där jag kör getCurrentWeather, vilket är när användaren trycker på
	//en stad i dropdown-listan med städer, och detta triggar också funktionen addCity
	const getCurrentWeather = async (cityId: any) => {
		try {
			const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${cityId}`)
			//Som exempel nedan med id:t för Paris (returnerar all väderinfo om paris med just detta id)
			//ROBIN: detta med Search API-formatet id:803267, det är bara att researcha, inget man borde veta? Och att läsa på noga om API:t, t.ex.
			//att man måste använda Search API för en sak och sedan Current för något annat?
			// const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:803267`)
			const data = await res.json()
			// console.log(data)
			setWeatherData(data)
			console.log(cityItems)
			// setEnteredCity('')
			// setCityItems([])

			return data
		} catch (error) {
			console.error('Error:', error)
		}
		setIsCityNotFound(false)
	}

	//NO MATCHING ENTRY
	const clearCityNotFoundString = () => {
		if (isCityNotFound) {
			setIsCityNotFound(false)
		}
	}

	//PRESS ARROW UP/DOWN OR ENTER
	//Lade till Array.isArray(cityItems) för att få bort squiggly på length eftersom jag måste försäkra mig om att det är en array
	const handleArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>, id: any) => {
		if (e.key === 'ArrowDown' && activeItem < cityItems.length - 1) {
			setActiveItem((prev) => prev + 1)
		} else if (e.key === 'ArrowUp' && activeItem > 0) {
			setActiveItem((prev) => prev - 1)
		}

		//ENTER KEY
		else if (e.key === 'Enter') {
			//If an item is selected, get its ID
			if (activeItem >= 0) {
				getCurrentWeather(cityItems[activeItem]?.id)
			}
			//If there is only one hit, get its ID
			else if (cityItems.length === 1) {
				getCurrentWeather(cityItems[0]?.id)
			}
			// Handle the case when Enter is pressed without selecting any item
			// You may want to add your desired behavior here
			else {
				// getCurrentWeather(cityItems[0]?.id)
				console.log('ohhh nooo')
			}
		}
		// else if (e.key === 'Enter' && cityItems.length === 1) {
		// 	getCurrentWeather(cityItems[0]?.id)
		// }
		// else if (e.key === 'Enter' && cityItems.length === 0) {
		// 	setActiveItem(0)
		// 	getCurrentWeather(cityItems[0]?.id)
		// }
		//Krävs det nån RESET???
	}

	//ADD CITY
	const addCity = () => {
		const newWeatherItem: NewWeatherItem = {
			id: new Date().getTime().toString(),
			cityName: weatherData?.location?.name,
			country: weatherData?.location?.country,
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

	//DELETE CITY
	const deleteCity = (id: string) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id)
		setWeatherList(updatedList)
		// localStorage.setItem('weatherItemAdded', JSON.stringify(updatedList))
		return updatedList
	}

	return (
		<main className={styles.grid}>
			<h1 className={styles.heading1}>Hur är vädret i...</h1>
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
					// onFocus={clearCityNotFoundString}
					autoComplete='off'
					onKeyDown={(e) => handleArrowKeys(e, activeItem)}
				/>
				{/* <button onClick={getCurrentWeather} className={styles.btn}>
					<Image src={plusSign} height={20} width={20} alt='Plus Sign' />
				</button> */}
			</div>

			{/* {weatherData && isCityNotFound && <p>Det finns ingen stad som matchar din sökning</p>} */}

			{/* Kollar att cityItems verkligen är en array (dvs. innehåller många träffar) och i så fall mappar den över, annars förutsätts
					 det att cityItems bara är/innehåller ett enda objekt, och då går det ju inte att mappa över, så i stället funkar cityItems.name rakt av */}
			{/* detta var klassen jag hade tidigare: className={styles.dataItem} */}
			<div className={styles.dataresult}>
				{Array.isArray(cityItems) ? (
					cityItems.map((item, i) => (
						<div
							key={i}
							// onClick={() => getCurrentWeather(item?.id)}
							onClick={() => getCurrentWeather(item?.id)}
							// onKeyDown={(e) => getCurrentWeatherOnEnter(e, item?.id)}
							className={`${activeItem === i ? `${styles.searchListItem} ${styles.active}` : styles.searchListItem}`}>
							<span>{item?.name} </span>(<span>{item?.country}</span>){/* <span>{item?.id}</span> */}
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
				{weatherData &&
					weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0)) &&
					weatherList.map((item, i) => (
						<div key={i}>
							{item.cityName && item.country && item.temperature && item.currCondition && (
								<WeatherCard
									cityName={item.cityName}
									temperature={item.temperature}
									currCondition={item.currCondition}
									country={item.country}
									deleteCity={() => deleteCity(item.id)}
								/>
							)}
						</div>
					))}
			</div>

			<Image src={logoAlster} width={30} height={30} alt='Alster Logotype' className={styles.logoAlster} />
		</main>
	)
}
