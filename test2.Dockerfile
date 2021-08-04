FROM node:12.22-alpine

EXPOSE 7001

CMD export NODE_ENV=test2 && \
    npm run node:dev

COPY . .

RUN cp -r /app/mvip-manager/dist/ /dist/public && \
    npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --production
