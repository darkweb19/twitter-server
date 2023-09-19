# Twitter Backend using TypeScript , Prisma , JWT Authentication, Apollo Server, and PostgreSQL DB

This is a backend server for a Twitter-like application built using TypeScript, Prisma ORM, JWT for user authentication, Apollo Server for GraphQL API, and PostgreSQL for the database.

## Prerequisites

Before you begin, ensure you have the following dependencies installed:

-   Node.js and npm (https://nodejs.org/)
-   PostgreSQL (https://www.postgresql.org/)

## Installation

1. Clone the repository:

-   git clone https://github.com/darkweb19/graphql-backend.git

2. Install dependencies:

-   npm install or yarn install

3. Set up the environment variables:

-   DATABASE_URL=postgresql://username:password@localhost:5432/twitterdb?schema=public

## Usage

The server should now be running at http://localhost:8000/graphhql. You can access the GraphQL Playground to interact with the API and perform queries and mutations.

## Project Structure

prisma/: Contains the database schema

src/: Contains the TypeScript source code.
src/app/: Contains all the queries , mutations , resolvers , types of both users and tweets.
src/services : Contains authentication logic and JWT handling for users and tweets.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
