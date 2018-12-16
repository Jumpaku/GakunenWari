FROM node:10.7.0-alpine

WORKDIR /home/dev

COPY ./dev /home/dev
RUN npm install http-server -g -y

CMD [ "ash" ]