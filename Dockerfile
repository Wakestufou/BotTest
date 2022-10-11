FROM node:16.14.0 AS dependencies
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install

FROM node:16.14.0 AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY ./ ./

FROM node:16.14.0 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
USER node
CMD ["node", "src/index.js"]