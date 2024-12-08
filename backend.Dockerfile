# Use the official Node.js image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .

# Copy .env.local to the working directory
COPY .env.prod .env

RUN npm install -g typescript
RUN npm install -g nodemon
RUN npm install -g ts-node
RUN npm install -g rimraf
RUN npm install -g cross-env
RUN npm install -g dotenv-cli

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build:prod

RUN npm run generate:prod
RUN npm run migrate:prod

# Expose the port the app runs on
EXPOSE 4500

CMD npm run start:prod