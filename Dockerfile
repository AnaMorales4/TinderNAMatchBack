# back/Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your app
COPY . .

EXPOSE 5000

# Start the app
CMD ["npm", "run", "dev"]
