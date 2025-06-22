# Этап 1: сборка проекта
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Этап 2: запуск на nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Настройки nginx для SPA (чтобы работал history mode)
COPY nginx.conf /etc/nclginx/conf.d/default.conf