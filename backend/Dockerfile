# base image
FROM node:12-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 9229

COPY package.json yarn.lock ./
RUN DISABLE_OPENCOLLECTIVE=true yarn install

COPY . .

CMD [ "node", "dist/index.js" ]
