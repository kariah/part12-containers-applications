FROM node:16

USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 
 
ENV DEBUG=frontend:*
 
ENV BACKEND_URL=http://localhost:3001/
 
CMD npm start