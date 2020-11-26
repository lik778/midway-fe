FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN cd ./app/mvip-manager && npm install

RUN npm install && npm run prod

COPY ./app/mvip-manager/dist ./dist/public

EXPOSE 8001

CMD npm run start:prod
