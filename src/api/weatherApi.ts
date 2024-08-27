const apiKey = process.env.NEXT_PUBLIC_API_KEY

export const fetchWeatherByIp = async () => {
	try {
		const res = await fetch(`//api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`)
		if (!res.ok) throw new Error('Network response was not ok')
		return await res.json()
	} catch (error) {
		console.error('Error fetching weather by IP:', error)
		throw error
	}
}

export const searchCity = async (cityName: string) => {
	try {
		const res = await fetch(`//api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`)
		if (!res.ok) throw new Error('Network response was not ok')
		return await res.json()
	} catch (error) {
		console.error('Error searching city:', error)
		throw error
	}
}

export const getCurrentWeather = async (cityId: number) => {
	try {
		const res = await fetch(`//api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${cityId}`)
		if (!res.ok) throw new Error('Network response was not ok')
		return await res.json()
	} catch (error) {
		console.error('Error fetching current weather:', error)
		throw error
	}
}
