# Minecraft Minute

A web application that collects and displays Twitch clips of streamers participating in the "Minecraft Minute" game.

**Live Website:** [https://minecraft-minute.ostof.dev/](https://minecraft-minute.ostof.dev/)

## What is Minecraft Minute?

Minecraft Minute is a daily game where players share one character, each playing for one minute per day, continuing from where the last left off.

## Features

- View Twitch clips of Minecraft Minute gameplay
- Sort clips by newest or oldest first
- Authentication with Twitch
- Add new clips (for authenticated users)
- Responsive design with Minecraft-inspired styling

## Technologies Used

- [Astro](https://astro.build/) - Web framework
- [Solid.js](https://www.solidjs.com/) - UI components
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless deployment
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite database
- [Twitch API](https://dev.twitch.tv/docs/api/) - Authentication and clip data
- [Astro Minecraft Theme](https://github.com/BryceRussell/astro-minecraft-theme) - Minecraft styling and fonts

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers CLI)
- A Cloudflare account
- A Twitch Developer account with registered application

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minecraft-minute.git
   cd minecraft-minute
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.dev.vars` file in the project root with your Twitch API credentials:
   ```
   TWITCH_CLIENT_ID=your_twitch_client_id
   TWITCH_CLIENT_SECRET=your_twitch_client_secret
   TWITCH_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

4. Set up the database:
   ```bash
   npm run db:dev
   ```

## Development

To start the development server:

```bash
npm run cf:preview
```

This will build the Astro application and start a local Wrangler development server at http://localhost:3000.

## Database Management

- Generate database migrations:
  ```bash
  npm run db:generate
  ```

- Apply migrations to local development database:
  ```bash
  npm run db:migrate:dev
  ```

- Apply migrations to production database:
  ```bash
  npm run db:migrate
  ```

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run cf:deploy
```

Make sure you have configured your Cloudflare account with Wrangler before deploying.

## Project Structure

The project follows a standard Astro project structure with additional organization for the application's specific needs:

### Source Code (`src/`)

- **actions/**: Contains action creators and handlers for form submissions and other user interactions
- **assets/**: Static assets like fonts and images used in the application
- **components/**: Reusable UI components (both Astro and Solid.js components)
  - Form components
  - UI elements like ClipTile, Footer, etc.
- **layouts/**: Layout templates that wrap pages for consistent structure
  - Layout.astro: The main layout template used across the application
- **lib/**: Core application logic and utilities
  - **db/**: Database connection and query logic using Drizzle ORM
  - **hooks/**: Custom Solid.js hooks for UI components
  - **model/**: Data models and type definitions
  - **utils/**: Utility functions and helpers
  - **web-services/**: Services for external API interactions (e.g., Twitch API)
- **pages/**: Page components and API routes
  - **api/**: Backend API endpoints
  - Main page templates (index.astro, etc.)
- **styles/**: Global CSS styles and theme definitions

### Configuration Files (Root)

- **astro.config.mjs**: Astro configuration
- **drizzle.config.ts**: Drizzle ORM configuration
- **tsconfig.json**: TypeScript configuration
- **wrangler.jsonc**: Cloudflare Workers configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.



# TODO's

- Allow trusted users to delete (duplicate) clips
- Find a way to play all clips one after another.
- Find a way to export clips
- Find a way to export a combined clip of all or selected clips
