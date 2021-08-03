FROM node:12.2

COPY /dist /dist
COPY /app/mvip-manager/dist/ /dist/public

EXPOSE 7001

CMD npm run node:dev
