FROM node:12

WORKDIR /usr/src

COPY . .

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    # npm ci && \
    npm ci --cache .npm --prefer-offline --quiet --no-progress && \
    npm run release:test2 && \
    cd app/mvip-manager/ && \
    npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    # npm ci && \
    npm ci --cache .npm --prefer-offline --quiet --no-progress && \
    npm run build:test && \
    cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run start:test2
