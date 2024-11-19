# Next.js Authentication App

This is a Next.js 14 application with a complete authentication flow, including email and password login, signup, reset password, and 2FA. The app is built with TypeScript, uses Drizzle ORM with a PostgreSQL database, and features the Next.js app router.

## Features

- **Next.js 14 App Router**
- **Email + Password Login**
- **Signup**
- **Password Reset**
- **Two-Factor Authentication (2FA)**
- **PostgreSQL Database with Drizzle ORM**
- **TypeScript**

## Screenshots

Here are some screenshots of the application:

| Login Screen                         | Dashboard                          |
| ------------------------------------ | ---------------------------------- |
| ![Login Screen](https://github.com/user-attachments/assets/d1a19bef-8f40-4687-a94c-2f478a78ceeb)| ![Dashboard](https://github.com/user-attachments/assets/7ce8bbf6-ccb9-4274-8655-74afdfe4e2f3)
) |

| 2FA Setup Screen                       | Password Reset Screen              |
| -------------------------------------- | ---------------------------------- |
| ![2FA Setup](https://github.com/user-attachments/assets/25d30ecf-8458-4ec4-9108-fb7de1454f4d)| ![Password Reset](https://github.com/user-attachments/assets/76b8c7e8-432f-4e1b-8876-6005df3d50b8)
) |

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- PostgreSQL (local or cloud-hosted)

### Running the App

1. **Clone the repository**:

   ```bash
   git clone https://github.com/pablin202/next-auth.git
   cd next-auth

2. **Install dependencies**:

   ```
    npm install

3. **Create your database**:

	•	Set up a PostgreSQL database, either locally or using a cloud service like Neon.
	•	Copy the database URL.

4. **Configure Environment Variables:**:
	•	Create a .env.local file in the root directory.
	•	Add the following environment variable, replacing the URL with your database URL:

   ```
    NEON_DATABASE_URL=your_database_url


4. **Run the Drizzle Kit Migration:**:
	•	Use Drizzle Kit to push the database schema to your database:

   ```
    npx drizzle-kit push

4. **Start the development server:**:

   ```
    npm run dev

The app should now be running at http://localhost:3000.

Scripts

	•	npm run dev: Start the development server.
	•	npm run build: Build the app for production.
	•	npm start: Start the production server.
	•	npx drizzle-kit push: Run the Drizzle ORM migration to set up your database schema.

Folder Structure

	•	/app: Main application directory, including routes and components.
	•	/db: Database schema and Drizzle configuration.
	•	/components: Reusable UI components.
	•	/lib: Utility functions and configuration files.
	•	/pages: Additional Next.js pages (e.g., _app.js, _document.js).

Technologies Used

	•	Next.js 14: Latest version of Next.js with the app router.
	•	TypeScript: Strongly typed JavaScript for better developer experience.
	•	Drizzle ORM: Lightweight ORM for PostgreSQL.
	•	PostgreSQL: Relational database for secure data storage.
	•	Two-Factor Authentication (2FA): Adds an extra layer of security.

License

This project is licensed under the MIT License - see the LICENSE file for details.
