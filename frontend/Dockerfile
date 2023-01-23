FROM node:19-alpine3.17

WORKDIR /home/node/app
COPY ./src/frontend/package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]