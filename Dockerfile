FROM node:16-alpine AS builder

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY src src
COPY *.config.js ./
COPY tsconfig.json ./

RUN npm run build

COPY build/public/index.html build/public/index.html

FROM node:16-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node
COPY --chown=node:node package*.json ./
RUN npm install --production

COPY --from=builder --chown=node:node /home/node/app/build build

ENV HTTP_PORT 80

EXPOSE 80

CMD [ "node", "build/server.js" ]