# Weather App

## Project Description

This Weather App is a Next.js-based web application that provides real-time weather information for various locations. Users can search for cities, view current weather conditions, and save and delete their favorite locations.

## Features

- Real-time weather data fetching
- City search functionality
- Saving favorite locations
- Responsive design for various devices
- Dynamic background images based on weather conditions

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Weather Rest API

## Installation and Setup

Before running the development server, follow these steps:

1. Clone the repository
   ```
   git clone https://github.com/your-username/weather-app.git
   ```
2. Navigate to the project directory
   ```
   cd weather-app
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Sign up for a WeatherAPI.com account

   - This project uses the [WeatherAPI.com](https://www.weatherapi.com/) service.
   - Go to [https://www.weatherapi.com/signup.aspx](https://www.weatherapi.com/signup.aspx) to create a free account and obtain an API key.

5. Create a `.env.local` file in the root directory and add your Weather API key:
   ```
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
