FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx tailwindcss init || echo "Skipping Tailwind init if exists"
RUN npx ng build my-angular-app --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/my-angular-app /usr/share/nginx/html

EXPOSE 80