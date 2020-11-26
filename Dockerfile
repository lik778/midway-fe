FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run prod

EXPOSE 7001

CMD npm run start:prod
