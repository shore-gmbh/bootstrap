FROM node:alpine

MAINTAINER Devald Tari <devald.tari@shore.com>

# npm cli login config
ENV bamboo_NPM_USER=@@@REPLACE_NPM_USER@@@
ENV bamboo_NPM_PASSWORD=@@@REPLACE_NPM_PASSWORD@@@
ENV bamboo_NPM_EMAIL=@@@REPLACE_NPM_EMAIL@@@

COPY / /application

WORKDIR /application

RUN \
apk add --no-cache git && \
npm install --global npm-cli-login && \
npm-cli-login \
-u ${bamboo_NPM_USER} \
-p ${bamboo_NPM_PASSWORD} \
-e ${bamboo_NPM_EMAIL} && \
npm install

CMD ["npm", "run", "build"]
