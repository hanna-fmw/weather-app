//Convert API date/time output to more readable format
export const formatLocalTime = (localTime) => {
	const date = new Date(localTime)

	const options = {
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'long',
		month: 'short',
		day: 'numeric',
	}

	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)

	return formattedDate
}
