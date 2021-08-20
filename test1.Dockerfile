FROM registry.gitlab.baixing.cn/arch/base-images/nodejs:14.16.0

EXPOSE 7001

CMD export NODE_ENV=test1 && \
    npm run node:dev

COPY app/mvip-manager/dist/ dist/public
COPY . .

RUN npm set registry https://registry.npm.taobao.org && \
    npm set progress=false && \
    npm ci --production
