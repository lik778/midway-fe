FROM registry.gitlab.baixing.cn/arch/base-images/nodejs:12.22-alpine

EXPOSE 7001

CMD export NODE_ENV=test1 && \
    npm run node:dev

COPY package*.json ./
RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --production && \
    npx modclean -rP

COPY app/mvip-manager/dist/ dist/public
COPY . .
