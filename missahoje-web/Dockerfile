FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only when package files change)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
