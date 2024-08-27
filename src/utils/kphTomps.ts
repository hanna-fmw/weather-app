//Convert from kph to ms for wind speed output

export const kphTomps = (kph: number): number => {
	return Number((kph * 0.277778).toFixed(2))
}
