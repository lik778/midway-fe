FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run prod

COPY ./app/mvip-manager/dist ./dist/public

EXPOSE 8001

CMD npm run start:prod
