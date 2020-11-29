# Build the server binary
FROM rust:1.48-buster as buildServer

# Add required build deps
RUN apt install openssl libssl-dev -y

# Copy over the files
RUN mkdir -p /wotclans/src
WORKDIR /wotclans
COPY ./src ./src
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

# build the program
# for debugging remove the --release
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

FROM debian:buster-slim

RUN apt update -y && apt install ca-certificates -y && mkdir /wotclans
WORKDIR /wotclans

COPY --from=buildServer /wotclans/target/release/wotnlclans ./wotclans
COPY ./config.json ./config.json
COPY ./icons ./icons
COPY --from=buildWeb /wotclans/web_static/build ./web_static/build
COPY --from=buildWeb /wotclans/web_static/manifest.json ./web_static/manifest.json

EXPOSE 8282

CMD ./wotclans
