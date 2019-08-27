FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

RUN npm install --save cors

RUN npm install mysql

RUN npm install bcryptjs

COPY --chown=node:node . .

EXPOSE 3004

CMD [ "node", "app.js" ]