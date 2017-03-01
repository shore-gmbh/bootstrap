FROM node:alpine

MAINTAINER Devald Tari <devald.tari@shore.com>

# surge credential
ENV SURGE_LOGIN=@@@REPLACE_NPM_EMAIL@@@
ENV SURGE_TOKEN=@@@REPLACE_SURGE_TOKEN@@@
# npm cli login config
ENV bamboo_NPM_USER=@@@REPLACE_NPM_USER@@@
ENV bamboo_NPM_PASSWORD=@@@REPLACE_NPM_PASSWORD@@@
ENV bamboo_NPM_EMAIL=@@@REPLACE_NPM_EMAIL@@@

COPY / /application

WORKDIR /application

RUN \
apk add --no-cache git openssh-client && \
git remote set-url origin ssh://git@bitbucket.shore.com/fe/bootstrap.git && \
git config --global user.email "it-bot@shore.com" && \
git config --global user.name "IT Bot" && \
npm install && \
npm install --global surge npm-cli-login && \
npm-cli-login \
-u ${bamboo_NPM_USER} \
-p ${bamboo_NPM_PASSWORD} \
-e ${bamboo_NPM_EMAIL}

CMD ["npm", "run", "release"]
