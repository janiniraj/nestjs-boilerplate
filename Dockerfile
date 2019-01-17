FROM node:9.2.0 AS dev

WORKDIR /usr/src/app

COPY . .

RUN npm i -g ts-node typescript

ENV NODE_ENV development

RUN npm install