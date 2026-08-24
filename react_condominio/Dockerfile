FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./

RUN npm ci --silent || npm install --silent

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM nginx:alpine AS final

RUN apk add --no-cache curl

RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx

RUN mkdir -p /run && chown -R nginx:nginx /run

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

RUN echo "ok" > /usr/share/nginx/html/health

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]
