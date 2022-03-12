FROM node:16

USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci 
 
ENV DEBUG=frontend:*

# ENV REACT_APP_BACKEND_URL=http://localhost:4000/
 
CMD npm startdock