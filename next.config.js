/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.weatherapi.com',
				port: '',
				pathname: '/weather/**',
			},
		],
	},
}

module.exports = nextConfig
