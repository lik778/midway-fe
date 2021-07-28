FROM node:12

WORKDIR /usr/src

COPY . .

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --prefer-offline --quiet --no-progress && \
    npm run release:dev

RUN cd app/mvip-manager/ && \
    npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --prefer-offline --quiet --no-progress && \
    npm run build:dev

RUN cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run start:dev
