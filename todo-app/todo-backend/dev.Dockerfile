FROM node:16

WORKDIR /usr/src/app

#COPY . .

FROM base as test
RUN npm ci
COPY . .
CMD [ "npm", "run", "test" ]

FROM base as prod
RUN npm install
COPY . .
CMD ["npm", "start"]


# From Solution

#FROM node:16

#WORKDIR /usr/src/app

#COPY --chown=node:node . .

#RUN npm ci

#USER node

#CMD npm run dev
