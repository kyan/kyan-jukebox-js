# base image
FROM node:8.9-slim

# set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json yarn.lock ./
RUN yarn

# start app
CMD ["yarn", "start"]
