# Build the server binary
FROM rust:alpine as buildServer

# Copy over the files
RUN mkdir -p /wotclans/src
WORKDIR /wotclans
COPY ./src ./src
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

# build the program
RUN cargo build --release

# Build the javascript files
FROM node:15-alpine as buildWeb

# Copy over the required files
RUN mkdir -p /wotclans/web_static
WORKDIR /wotclans/web_static
COPY ./web_static .
COPY ./config.json /wotclans/config.json

# Build the webserver data
RUN npm i && npm run build

FROM alpine

RUN apk add ca-certificates && mkdir /wotclans
WORKDIR /wotclans

COPY --from=buildServer /wotclans/target/ ./wotclans
COPY ./config.json ./config.json
COPY ./icons ./icons
COPY --from=buildWeb /wotclans/web_static/build ./web_static/build
COPY --from=buildWeb /wotclans/web_static/manifest.json ./web_static/manifest.json

EXPOSE 8282

CMD ./wotclans
