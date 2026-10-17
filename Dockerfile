# Stage: build
FROM node:22-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage: serve
FROM nginx:alpine
COPY --from=build /app/dist/book-keeper/browser /usr/share/nginx/html

EXPOSE 80