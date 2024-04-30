/* eslint-disable @next/next/no-img-element */
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';
import './globals.css';
import WeatherCard from '@/components/WeatherCard';
import logoAlster from '../../public/logoAlster.png';
import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Popup from '@/components/Popup';
import { formatLocalTime } from './utils/dateFormatting';
import { kphTomps } from './utils/kphTomps';
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

type WeatherData = {
	location: {
		name: string;
		country: string;
		localtime: string;
	};
	current: {
		temp_c: number;
		is_day: number;
		feelslike_c: number;
		humidity: number;
		cloud: number;
		wind_kph: number;
		condition: {
			text: string;
			icon: string;
			code: number;
		};
	};
};

type NewWeatherItem = {
	id?: string;
	cityName?: string;
	temperature?: number;
	currConditionText?: string;
	currConditionCode?: number;
	currConditionIcon?: string;
	country?: string;
	isDay?: number;
	localTime?: string;
	feelslike?: number;
	humidity?: number;
	cloud?: number;
	wind?: number;
};

type CityItem = {
	id?: number;
	name?: string;
	country?: string;
};

type BannerCity = {
	location: {
		name: string;
		country: string;
	};
	current: {
		temp_c: number;
		condition: {
			text: string;
			icon: string;
		};
	};
};

export default function Home() {
	const [enteredCity, setEnteredCity] = useState<string>('');
	const [weatherList, setWeatherList] = useState<NewWeatherItem[]>([]);

	const [weatherByIp, setWeatherByIp] = useState<WeatherData | null>(null);

	// @ts-ignore comment
	const [displayInContentContainer, setDisplayInContentContainer] = useState<NewWeatherItem>(weatherByIp);

	const [weatherData, setWeatherData] = useState<null | WeatherData>(null);
	const [isCityNotFound, setIsCityNotFound] = useState<boolean>(false);

	const [isInputEmpty, setIsInputEmpty] = useState<boolean>(false);

	//Suggestion List (from Search API)
	const [cityItems, setCityItems] = useState<CityItem[] | CityItem>([]);

	//Keep track of active item in suggestion list array
	const [activeItem, setActiveItem] = useState(-1);

	//Already added
	const [isAlreadyAdded, setIsAlreadyAdded] = useState<boolean>(false);

	const [bannerCities, setBannerCities] = useState<null | BannerCity[]>([]);

	const [isDay, setIsDay] = useState<boolean>(false);

	const fetchWeatherByIp = async () => {
		const res = await fetch(`//api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`);
		const data = await res.json();
		// console.log('Data from ip lookup api', data);

		setWeatherByIp(data);
	};

	//RETRIEVE FROM LOCAL STORAGE
	useEffect(() => {
		const getInitialData = async () => {
			await fetchWeatherByIp();
			if (localStorage.length !== 0) {
				const storedItems = localStorage.getItem('weatherList');
				const storedItemsArray = storedItems ? JSON.parse(storedItems) : [];
				Array.isArray(storedItemsArray) && setWeatherList(storedItemsArray);
				// console.log('Stored Items Array', storedItemsArray);
			} else {
				console.log('');
			}
		};
		getInitialData();
	}, []);

	useEffect(() => {
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
			});
		}
		if (isDay) {
			setIsDay(true);
		} else {
			setIsDay(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherByIp]);

	useEffect(() => {
		if (weatherList.length !== 0) {
			const updatedWeatherList = weatherList.sort((a, b) => (a.temperature && b.temperature ? a.temperature - b.temperature : 0));
			setWeatherList(updatedWeatherList);
		}
	}, [weatherList]);

	useEffect(() => {
		if (weatherData && weatherData.location && weatherData.location.name && weatherData.location.country) {
			addCity();
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weatherData]);

	const handleOnChange = (value: string) => {
		setEnteredCity(value);
		debounced(value);
	};

	const debounced = useDebouncedCallback((value) => {
		searchCity(value);
	}, 100);

	const searchCity = async (cityName: string) => {
		try {
			const res = await fetch(`//api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`);
			const cityData = await res.json();
			setCityItems(cityData);
			setActiveItem(0);
			return cityData;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const getCurrentWeather = async (cityObject: any) => {
		const alreadyAdded = weatherList.some((weatherItem) => weatherItem.cityName === cityObject.name && weatherItem.country === cityObject.country);
		if (alreadyAdded) {
			timeoutAlreadyAdded();
			setCityItems([]);
		} else {
			try {
				const res = await fetch(`//api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${cityObject.id}`);
				const data = await res.json();

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
					setWeatherData(data);
					setEnteredCity('');
					setCityItems([]);
				} else {
					console.error('Error:', data);
				}
				if (data.current.is_day) {
					setIsDay(true);
				} else {
					setIsDay(false);
				}

				return data;
			} catch (error) {
				console.error('Error:', error);
			}
		}
	};

	//SHOW/HIDE CITY NOT FOUND WARNING
	const timeoutCityNotFoundString = () => {
		setIsCityNotFound(true);
		setTimeout(() => {
			setIsCityNotFound(false);
		}, 2000);
		setEnteredCity('');
	};

	//SHOW/HIDE EMPTY INPUT FIELD WARNING
	const timeoutNoInput = () => {
		setIsInputEmpty(true);
		setTimeout(() => {
			setIsInputEmpty(false);
		}, 2000);
		setEnteredCity('');
	};

	//SHOW/HIDE CITY NOT FOUND WARNING
	const timeoutAlreadyAdded = () => {
		setIsAlreadyAdded(true);
		setTimeout(() => {
			setIsAlreadyAdded(false);
		}, 2000);
		setEnteredCity('');
	};

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
		};

		//Update local storage after adding new item
		const updatedWeatherList = [...weatherList, newWeatherItem];
		// @ts-ignore comment
		setWeatherList(updatedWeatherList);

		localStorage.setItem('weatherList', JSON.stringify(updatedWeatherList));
		// @ts-ignore comment
		setDisplayInContentContainer(newWeatherItem);
	};

	//DELETE CITY
	const deleteCity = (id: string | undefined) => {
		const updatedList = [...weatherList].filter((item) => item.id !== id);
		setWeatherList(updatedList);
		//Update local storage after deleting an item
		localStorage.setItem('weatherList', JSON.stringify(updatedList));
		return updatedList;
	};

	//HANDLE KEY NAVIGATION (ARROWS & ENTER)
	const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case 'ArrowDown':
				Array.isArray(cityItems) && activeItem < cityItems.length - 1 && setActiveItem((prev) => prev + 1);
				break;

			case 'ArrowUp':
				activeItem > 0 && setActiveItem((prev) => prev - 1);
				break;

			case 'Enter':
				handleEnterKey();
				break;

			default:
				break;
		}
	};

	const handleEnterKey = () => {
		const cityFound = Array.isArray(cityItems) && cityItems.some((item) => item.name?.toLowerCase().includes(enteredCity.toLowerCase()));

		if (!enteredCity) {
			timeoutNoInput();
			return;
		}

		if (!cityFound) {
			timeoutCityNotFoundString();
			return;
		}

		if (activeItem >= 0) {
			Array.isArray(cityItems) && getCurrentWeather(cityItems[activeItem]);
			return;
		}

		if (Array.isArray(cityItems) && cityItems.length === 1) {
			Array.isArray(cityItems) && getCurrentWeather(cityItems[0]);
			return;
		}
	};

	const clearLocalStorage = () => {
		localStorage.clear();
		setWeatherList([]);
	};

	const getBackgroundImage = (isDay: boolean) => {
		let timeOfDay = isDay ? 'day' : 'night';
		const code = weatherData?.current.condition.code;

		switch (timeOfDay) {
			case 'day':
				switch (code) {
					case 1000:
						return '/bgImages/day/sun.jpg';
						break;
					case 1003:
						return '/bgImages/day/cloud.jpg';
						break;
					case 1006:
						return '/bgImages/day/cloud.jpg';
						break;
					case 1009:
						return '/bgImages/day/cloud.jpg';
						break;
					case 1030:
					case 1135:
						return '/bgImages/day/mist.jpg';
						break;
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
						return '/bgImages/day/rain.jpg';
						break;

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
						return '/bgImages/day/snow.jpg';
						break;

					case 1087:
					case 1273:
					case 1276:
						return '/bgImages/day/thunder.jpg';
						break;
					default:
						return '/bgImages/day/cloud.jpg';
				}
			case 'night':
				switch (code) {
					case 1000:
						return '/bgImages/night/night-clear-sky.jpg';
					case 1003:
						return '/bgImages/night/night-cloud.jpg';
					case 1006:
						return '/bgImages/night/night-cloud.jpg';
					case 1009:
						return '/bgImages/night/night-cloud.jpg';

					case 1030:
					case 1135:
						return '/bgImages/night/night-mist.jpg';
						break;
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
						return '/bgImages/night/night-rain.jpg';
						break;

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
						return '/bgImages/night/night-snow.jpg';
						break;

					case 1087:
					case 1273:
					case 1276:
						return '/bgImages/night/night-thunder.jpg';
						break;
					default:
						return '/bgImages/night/night-cloud.jpg';
				}
		}
	};

	let backgroundImage = getBackgroundImage(isDay);

	return (
		<main className={styles.main} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
			<section className={styles.container}>
				<article className={styles.weatherInfoContainer}>
					<h1 className={styles.cityTemp}>{displayInContentContainer?.temperature?.toFixed(1)}&#176;</h1>
					<div>
						<h1 className={styles.cityName}>{displayInContentContainer?.cityName}</h1>
						<p className={styles.localTime}>{displayInContentContainer?.localTime}</p>
					</div>
					<div>
						<img src={displayInContentContainer?.currConditionIcon} width={40} height={40} className={styles.weatherIcon} alt='Weather icon' />
						<aside className={styles.weatherCondition}>{displayInContentContainer?.currConditionText}</aside>
					</div>
				</article>

				<ul className={styles.weatherDetailsContainer}>
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
							);
						})}
				</div>
			</aside>
		</main>
	);
}
