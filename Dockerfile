FROM 657578906753.dkr.ecr.eu-west-1.amazonaws.com/nodejs:frontend-app-base-image
MAINTAINER DevOpsTeam <devops@shore.com>
CMD ["npm", "run", "build"]
