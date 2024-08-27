export const formatLocalTime = (localTime: string) => {
	if (!localTime || isNaN(new Date(localTime).getTime())) {
		return ''
	}

	const date = new Date(localTime)

	const options: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'long',
		month: 'short',
		day: 'numeric',
	}

	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)

	return formattedDate
}
