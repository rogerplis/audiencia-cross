# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the static files
FROM node:20-alpine

WORKDIR /app

# Install `serve` to act as a static file server
RUN npm install -g serve

# Copy the build output from the build stage
COPY --from=build /app/dist .

# Expose port 3000
# Traefik will connect to this port
EXPOSE 3000

# Run the server
# The -s flag is important for single-page applications
CMD ["serve", "-s", ".", "-l", "3000"]
