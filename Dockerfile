FROM node:14 as builder
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]