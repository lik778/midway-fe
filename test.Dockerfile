FROM node:12.2

RUN cp -r app/mvip-manager/dist/* dist/public/

EXPOSE 7001

CMD npm run node:test
