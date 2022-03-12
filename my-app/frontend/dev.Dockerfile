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

# Change npm ci to npm install since we are going to be in development mode
# RUN npm install

# # npm start is the command to start the application in development mode
# CMD ["npm", "start"]