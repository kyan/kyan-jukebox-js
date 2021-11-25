# base image
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN DISABLE_OPENCOLLECTIVE=true yarn install

COPY . .

CMD [ "yarn", "start" ]
