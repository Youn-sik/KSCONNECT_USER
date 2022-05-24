FROM node:16

WORKDIR /usr/src/KSCONNECT

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000
CMD [ "node", "index.js" ]
