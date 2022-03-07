FROM node:16

USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 
 
ENV DEBUG=todo-frontend:*

ENV REACT_APP_BACKEND_URL=http://localhost:3001/
 
CMD npm start