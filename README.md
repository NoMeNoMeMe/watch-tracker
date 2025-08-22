# Watch Tracker

## Project Description

Watch Tracker is a comprehensive application designed to help users manage and track their watch collections. Whether you're a casual collector or a seasoned horologist, this tool provides an intuitive interface to catalog, analyze, and maintain your timepieces.

## Technologies Used

- **Frontend**: React.js (for building the user interface)
- **Backend**: Node.js with Express.js (for handling API requests)
- **Database**: SQLite (for storing watch collection data)
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication
- **Styling**: Tailwind CSS (for responsive and modern UI design)
- **Build Tools**: Vite (for frontend development and build)
- **TypeScript**: Used across both frontend and backend for type safety

## Architecture

The application follows a modular and scalable architecture:

1. **Frontend**:
   - Built with React.js using a component-based structure.
   - Communicates with the backend via RESTful APIs.
   - State management is handled using Zustand.

2. **Backend**:
   - Developed with Node.js and Express.js.
   - Implements a RESTful API for CRUD operations.
   - Middleware for authentication and validation.
   - Follows the principles of Hexagonal Architecture (Ports and Adapters) to ensure a clean separation of concerns:
     - **Core Domain**: Contains the business logic and domain models.
     - **Application Layer**: Handles use cases and orchestrates interactions between the core domain and external systems.
     - **Adapters**: Includes controllers, database repositories, and other external integrations.

3. **Database**:
   - SQLite is used as the primary database.
   - TypeORM is used for schema modeling and data validation.

4. **Authentication**:
   - Secure user authentication using JWT.
   - Passwords are hashed using bcrypt and migrations are supported for password updates.

5. **Deployment**:
   - Deployment is managed locally or on cloud platforms as needed.

## How to Run the Project

Follow these steps to set up and run the Watch Tracker application locally:

### Prerequisites
- Node.js with npm

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd watch-tracker
   ```

2. **Install Dependencies**:
   ```bash
   # In the root folder
   npm run init
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `server` directory with the following variables:
     ```
     OMDB_API_KEY=<your_omdb_api_key>
     JWT_SECRET=<your_jwt_secret>
     NODE_ENV=development
     ```

   - Create a `.env` file in the `web` directory if needed for API URLs.
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3001/api
     ```

4. **Run the Application**:
   - You can run the entire application using Turbo:
     ```bash
     npm run turbo
     ```

     or

     ```bash
     turbo dev
     ```

     - Alternatively you can run server and client separately:

   - Start the backend server:
     ```bash
     cd ./packages/server
     npm start
     ```

   - Start the frontend development server:
     ```bash
     cd ../web
     npm start
     ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:5173`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
