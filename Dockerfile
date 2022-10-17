FROM node:16.13.0 AS dependencies
WORKDIR /usr/src/app
COPY ./package*.json ./
COPY ./db ./
RUN npm install

FROM node:16.13.0 AS builder
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/db ./db
COPY ./ ./
RUN npm run build

FROM node:16.13.0 AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/db ./db
USER node
CMD ["node", "dist/index.js"]