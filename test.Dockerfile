FROM node:12.22-alpine

COPY . .
COPY /app/mvip-manager/dist/ /dist/public

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --production

EXPOSE 7001

CMD export NODE_ENV=test && \
    npm run node:dev
