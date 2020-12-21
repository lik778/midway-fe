FROM node:12

WORKDIR /usr/src

COPY . .

RUN npm set registry https://registry.npm.taobao.org && npm install && npm run release:prod && cd app/mvip-manager/ && npm install && npm run build:prod \
    && cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/ \
    && cp -r /usr/src/app/mvip-manager/dist/**/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run start:prod
