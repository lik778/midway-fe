FROM node:12.2

WORKDIR /usr/src

COPY . .

RUN cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run node:dev
