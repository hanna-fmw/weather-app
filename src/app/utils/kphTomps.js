//Convert from kph to ms for wind speed output
export const kphTomps = (kph) => {
	const conversionFactor = 0.277778
	const mps = kph * conversionFactor
	return mps
}
