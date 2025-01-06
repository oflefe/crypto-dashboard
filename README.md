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

2. Run redis and postgres:

```bash
docker compose up
```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## Project Structure

- `binance.utils.ts` handles interactions between Binance API and the backend service including ticker streams
- NestJs for scalability, readability and modularity. 
- Typescript for static type checking. 
- prisma ORM to interact with the PostgreSQL tables, to save users and their subscriptions
- User modules to handle requests regarding user creation, login, subscribing (DB calls and persisting)
- Socket io to handle multiple clients and serve them data accordingly
- App subscribes to all 100 symbols, serves the ones users are subscribed to, or whoever joins the details room for that symbol.
- **Dockerization**: containerize the service using docker, for ease of deployment and development. 
- 
