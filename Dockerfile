FROM node:16.14.0 AS dependencies
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

COPY . .

CMD ["node", "src/index.js"]