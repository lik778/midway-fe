FROM node:12.2

COPY . .

RUN npm install cross-env

EXPOSE 7001

CMD npm run node:dev
