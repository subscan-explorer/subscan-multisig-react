FROM node:20 as builder
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN CYPRESS_INSTALL_BINARY=0 npm ci

COPY . /app/

RUN npm run check

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
