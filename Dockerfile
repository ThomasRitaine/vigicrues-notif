ARG NODE_VERSION=20-alpine


###################
# PRODUCTION
###################

FROM node:${NODE_VERSION} As prod

ENV NODE_ENV production

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

CMD npm run prod

