FROM nginx:mainline-alpine

COPY ./nginx-http.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html
