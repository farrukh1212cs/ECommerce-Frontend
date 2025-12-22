FROM node:20.19-alpine AS build

WORKDIR /app

# Install dependencies (use npm ci for reproducible installs)
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build the Angular app
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from the builder stage
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
