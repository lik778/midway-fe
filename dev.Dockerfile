FROM node:12

WORKDIR /usr/src

COPY . .

RUN npm install && npm run release:dev && cd app/mvip-manager/ && npm install && npm run build \
    && cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/ \
    && cp -r /usr/src/app/mvip-manager/dist/**/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run start:dev
