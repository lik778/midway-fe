FROM node:12

WORKDIR /usr/src

COPY . .

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --prefer-offline --quiet --no-progress && \
    echo '[NEST] NPM INSTALL DONE' && \
    npm run release:dev && \
    echo '[NEST] BUILD DONE' && \
    cd app/mvip-manager/ && \
    npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --prefer-offline --quiet --no-progress && \
    echo '[MVIP] NPM INSTALL DONE' && \
    npm run build:dev && \
    echo '[MVIP] BUILD DONE' && \
    cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/ \
    echo '[MVIP] START DEV SERVER'

EXPOSE 7001

CMD npm run start:dev
