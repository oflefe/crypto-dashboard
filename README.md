# Crypto Dashboard Backend

This project is the backend for a real-time cryptocurrency dashboard, built with **NestJS**.

## Features

- **WebSocket Support**: Real-time updates for cryptocurrency trading pairs.
- **Redis Integration**: Manages user-specific subscriptions efficiently.
- **Binance API Integration**: Fetches and streams live ticker data.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Project Structure

```
backend/
├── src/
│   ├── common/          # Utilities and shared modules
│   ├── modules/         # Feature-specific modules
│   ├── main.ts          # Entry point
├── .env                 # Environment variables
├── .gitignore           # Ignored files for Git
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```
