# base image
FROM node:12-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3001
ENV PORT $PORT
EXPOSE $PORT

RUN npm install -g npm@latest

COPY package*.json ./
RUN npm ci --no-optional

COPY . .

CMD [ "npm", "start" ]
