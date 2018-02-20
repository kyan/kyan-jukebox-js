# base image
FROM node:8.9-slim

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install node_modules with yarn
ADD package.json yarn.lock /tmp/
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cd /usr/src/app && ln -s /tmp/node_modules

# start app
CMD ["yarn", "start"]
