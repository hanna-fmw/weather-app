export const getBackgroundImage = (isDay, code) => {
	let timeOfDay = isDay ? 'day' : 'night'

	switch (timeOfDay) {
		case 'day':
			switch (code) {
				case 1000:
					return '/bgImages/day/sun.jpg'
					break
				case 1003:
					return '/bgImages/day/cloud.jpg'
					break
				case 1006:
					return '/bgImages/day/cloud.jpg'
					break
				case 1009:
					return '/bgImages/day/cloud.jpg'
					break
				case 1030:
				case 1135:
					return '/bgImages/day/mist.jpg'
					break
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
					return '/bgImages/day/rain.jpg'
					break

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
					return '/bgImages/day/snow.jpg'
					break

				case 1087:
				case 1273:
				case 1276:
					return '/bgImages/day/thunder.jpg'
					break
				default:
					return '/bgImages/day/cloud.jpg'
			}
		case 'night':
			switch (code) {
				case 1000:
					return '/bgImages/night/night-clear-sky.jpg'
				case 1003:
					return '/bgImages/night/night-cloud.jpg'
				case 1006:
					return '/bgImages/night/night-cloud.jpg'
				case 1009:
					return '/bgImages/night/night-cloud.jpg'

				case 1030:
				case 1135:
					return '/bgImages/night/night-mist.jpg'
					break
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
					return '/bgImages/night/night-rain.jpg'
					break

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
					return '/bgImages/night/night-snow.jpg'
					break

				case 1087:
				case 1273:
				case 1276:
					return '/bgImages/night/night-thunder.jpg'
					break
				default:
					return '/bgImages/night/night-partly-cloudy.jpg'
			}
	}
}
