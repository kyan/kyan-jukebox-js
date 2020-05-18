# base image
FROM node:12-alpine

# create app dir
RUN mkdir -p /opt/app

# set our node environment, overide in compose
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 8080 for node, and 5858 or 9229 for debug
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT 5858 9229

# install latest npm
RUN npm install -g npm

# install dependencies first, in a different location for easier app bind mounting for local development
WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

CMD [ "node", "index.js" ]
