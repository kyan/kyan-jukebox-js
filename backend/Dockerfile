# base image
FROM node:12-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9229

RUN npm install -g npm@latest

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "dist/index.js" ]
