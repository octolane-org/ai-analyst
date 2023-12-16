FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .husky ./.husky

RUN npm install

COPY ./ /usr/src/app

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]