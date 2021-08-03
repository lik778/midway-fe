FROM node:12.2

COPY . .

EXPOSE 7001

CMD npm run node:dev
