# base image
FROM node:12-alpine

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3001
ENV PORT $PORT
EXPOSE $PORT

COPY package.json yarn.lock ./
RUN DISABLE_OPENCOLLECTIVE=true yarn install

COPY . .

CMD [ "npm", "start" ]
