import { NewWeatherItem } from '../types/weatherTypes'
import styles from '../app/page.module.css'
import Image from 'next/image'
import { formatLocalTime } from '@/utils/dateFormatting'
import { kphTomps } from '@/utils/kphTomps'

type WeatherInfoProps = {
	displayInContentContainer: NewWeatherItem | null
}

export default function WeatherInfo({ displayInContentContainer }: WeatherInfoProps) {
	if (!displayInContentContainer) return null

	//Convert protocol-relative URL to HTTPS
	const iconUrl = displayInContentContainer.currConditionIcon.startsWith('//')
		? `https:${displayInContentContainer.currConditionIcon}`
		: displayInContentContainer.currConditionIcon

	return (
		<>
			<article className={styles.weatherInfoContainer}>
				<div>
					<h1 className={styles.cityTemp}>{displayInContentContainer.temperature}°</h1>
					<h2 className={styles.cityName}>{displayInContentContainer.cityName}</h2>
					<p className={styles.localTime}>{formatLocalTime(displayInContentContainer.localTime)}</p>
				</div>
				<div>
					<Image
						src={iconUrl}
						alt={displayInContentContainer.currConditionText}
						width={32}
						height={32}
						className={styles.weatherIcon}
					/>
					<p className={styles.weatherCondition}>{displayInContentContainer.currConditionText}</p>
				</div>
			</article>

			<ul className={styles.weatherDetailsContainer}>
				<li>Feels like {displayInContentContainer.feelslike}°</li>
				<li>Humidity: {displayInContentContainer.humidity}%</li>
				<li>Cloud: {displayInContentContainer.cloud}%</li>
				<li>Wind: {kphTomps(displayInContentContainer.wind)} m/s</li>
			</ul>
		</>
	)
}
