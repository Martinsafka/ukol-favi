# FAVI Task

This project is a simple web application that uses json-server for the backend and http-server-spa for the frontend. The application allows you to view a list of products and their details.

## Requirements

Before you begin, make sure you have Node.js and npm (Node Package Manager) installed on your system.

## Installation

1. **Clone the repository:**

```bash
   git clone <your-repository-url>
   cd favi-ukol
   ```
2. **Install dependencies:**

```bash
   npm install
```

## Running the Application
This project utilizes json-server to simulate a backend API and http-server-spa to serve the single-page application (SPA).

**You can start the application using the following command:**

```bash
   npm start
```

**This command will run both parts concurrently:**

    json-server: Runs on port 3000 and provides the API for the products.
    http-server-spa: Runs on port 8080 and serves the frontend application.

**Once started, you can visit the application at:**

    Frontend: http://localhost:8080
    Backend API: http://localhost:3000

## Project Structure

    1. data/db.json: Contains mock data served by json-server.
    2. index.html: The main HTML file for the application.
    3. modal.js: Contains JavaScript code for handling the modal dialog.
    4. styles.css: Contains CSS styles for the application.

## Scripts

```bash
    npm run db-start: Starts json-server on port 3000.
    npm run serve: Starts http-server-spa on port 8080.
    npm start: Runs both servers concurrently using concurrently.
```

## Additional Notes

    Ensure that ports 3000 and 8080 are free, as the application will need them.
    For changes in HTML, CSS, or JS files, simply modify the respective files, and the application will update automatically upon page refresh.
