FROM node:16-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY main.js .
COPY logger/index.js ./logger/
RUN npm i
CMD ["node","main.js"]