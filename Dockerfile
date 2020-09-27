FROM node:14.11.0-slim

WORKDIR /app

RUN apt-get update \
    #&& apt-get -y install python2.7 python-pip

# install dependencies (
COPY package.json package.lock.json /app/
RUN npm install --pure-lockfile

# copy all other files
COPY . /app

RUN npm build

EXPOSE 80

# run the application
CMD ["node", "--max-old-space-size=1024", "dist/main.js"]