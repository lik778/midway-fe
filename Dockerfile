FROM registry.gitlab.baixing.cn/arch/base-images/nodejs:14.16.0

WORKDIR /usr/src

COPY . .

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    # ! ./dist
    npm ci --cache .npm --prefer-offline --quiet --no-progress && \
    npm run build:prod && \
    cd app/mvip-manager/ && \
    npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    # ! ./app/mvip-manager/dist
    npm ci --cache .npm --prefer-offline --quiet --no-progress && \
    npm run build:prod && \
    # !
    cp -r /usr/src/app/mvip-manager/dist/* /usr/src/dist/public/

EXPOSE 7001

CMD npm run node:prod
