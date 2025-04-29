# 1) Build stage: install deps & create the production bundle
FROM node:18-alpine AS builder

WORKDIR /app

# copy package files and install only prod deps
COPY package.json package-lock.json ./
RUN npm ci

# copy the rest and build
COPY . .
RUN npm run build

# 2) Run stage: install a static server & ship only the built files
FROM node:18-alpine

WORKDIR /app

# install serve globally
RUN npm install -g serve

# copy over only the build output
COPY --from=builder /app/dist ./dist

# serve on port 3000
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
