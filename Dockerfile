FROM node:22-bookworm-slim@sha256:1c18d9ab3af4585870b92e4dbc5cac5a0dc77dd13df1a5905cea89fc720eb05b

ENV INSTALL_PATH=/barber-shop-ui

RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package*.json ./

RUN yarn global add @angular/cli@19.2.7
#RUN npm i -g @angular/cli@19.2.7  --save-dev

RUN yarn install
#RUN npm install

COPY . .