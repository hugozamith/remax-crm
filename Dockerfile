FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV HOSTNAME=::

EXPOSE 3000

CMD ["npm", "run", "start"]
