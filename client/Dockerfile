FROM node:alpine


WORKDIR /app
RUN apk add --update git
COPY package.json ./
RUN npm install
COPY ./ ./


CMD ["npm", "run", "dev"]
