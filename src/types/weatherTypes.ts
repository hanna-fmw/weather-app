export type WeatherData = {
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

export interface NewWeatherItem {
	id: string
	cityName: string
	country: string
	temperature: number
	currConditionText: string
	currConditionCode: number
	currConditionIcon: string
	isDay: number
	localTime: string
	feelslike: number
	humidity: number
	cloud: number
	wind: number
}

export type CityItem = {
	id?: number
	name?: string
	country?: string
}

export type BannerCity = {
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

export interface WeatherAPIResponse {
	location?: {
		name?: string;
		country?: string;
		localtime?: string;
	};
	current?: {
		temp_c?: number;
		is_day?: number;
		feelslike_c?: number;
		humidity?: number;
		cloud?: number;
		wind_kph?: number;
		condition?: {
			text?: string;
			icon?: string;
			code?: number;
		};
	};
}
