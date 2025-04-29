# 1) Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build              # produces /app/dist

# 2) Production stage
FROM nginx:stable-alpine

# Copy your custom nginx.conf if you have one, otherwise the default will serve /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (or change as you like)
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
