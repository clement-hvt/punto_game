FROM node:19-alpine3.17

WORKDIR /home/node/app
COPY package*.json .

RUN npm install && \
    npm install -g bcrypt && \
    npm link bcrypt

EXPOSE 3000

CMD ["npm", "start"]