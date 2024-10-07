# Gynger Bills Service

This Express service allows users to upload CSV files, process them to create Bill entries, and fetch the stored bills. It utilizes TSOA for API documentation and validation.

## Features

-   Upload CSV files to create new Bill entries.
-   Fetch the list of existing Bill entries.
-   Deduplicate bills based on the provided criteria.
-   API documentation and validation powered by TSOA.

## API Documentation

You can view the automatically generated API documentation at `{url}/docs`.

## Installation

1. Clone the repository
    ```bash
    git clone https://github.com/your-repo/gynger-bills-service.git
    ```
2. Install dependencies
    ```bash
    npm install
    ```

## Running the Service

### Development Mode

To run the service in development mode with automatic restarts on changes:

```bash
npm run dev
```

### Production Mode

To run the compiled service in production:

```bash
npm run start
```

### Build the Project

To compile the TypeScript code into JavaScript:

```bash
npm run build
```

## Generating Routes and API Spec

The service uses TSOA to generate routes and OpenAPI documentation. You can regenerate them using the following scripts:

-   Generate API routes:

    ```bash
    npm run routes
    ```

-   Generate OpenAPI spec:
    ```
    npm run spec
    ```

## API Endpoints

-   **POST /uploadCsv** - Upload a CSV file and create Bill entries.
-   **GET /bills** - Fetch the list of existing bills.

## Project Structure

-   `src/` - Contains the source code for the service.
-   `dist/` - Compiled JavaScript files after running `npm run build`.
-   `src/controllers` - Contains the TSOA controller logic.
-   `src/services` - Contains the business logic for handling bills.
-   `src/utils` - Contains utility functions, like CSV parsing.

## Scripts

-   `start`: Run the production server.
-   `dev`: Run the development server with automatic restarts using nodemon.
-   `devtest`: Run the development server using `ts-node`.
-   `build`: Compile TypeScript to JavaScript.
-   `routes`: Generate the TSOA routes.
-   `spec`: Generate the OpenAPI spec.

## Dependencies

-   **Express** - Web framework for handling API requests.
-   **TSOA** - To handle OpenAPI documentation and request validation.
-   **Multer** - Middleware for handling file uploads.
-   **csv-parser** - For parsing CSV files.

## Future Enhancements

-   Add test cases for service endpoints.
-   Enhance error handling and validation for file uploads.

## License

This project is licensed under the MIT License.
