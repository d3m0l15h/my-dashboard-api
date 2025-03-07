# Stage 1: Build the application
FROM node:18.20-alpine3.19 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install dependencies
RUN npm ci

# Build the NestJS application
RUN npm run build

# Remove the development dependencies
RUN npm prune --production

# Stage 2: Run the application
FROM node:18.20-alpine3.19 AS server

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/
COPY --from=build /app/.env.production /app/

# Expose the application port
EXPOSE 3001

# Define the command to run the application
CMD ["npm", "run", "start:prod"]