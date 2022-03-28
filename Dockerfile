FROM node:16
WORKDIR /user/src/app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]