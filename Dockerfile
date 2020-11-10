# Build the server binary
FROM golang:1.15-alpine as buildServer

# Copy over the files
RUN mkdir -p /go/src/github.com/mjarkk/wotclans
WORKDIR /go/src/github.com/mjarkk/wotclans
COPY ./ ./

# build the program
RUN GOOS=linux GARCH=amd64 CGO_ENABLED=0 go build -o wotclans -v -a -installsuffix cgo


# Build the javascript files
FROM node:15-alpine as buildWeb

# Copy over the current state from
COPY --from=buildServer /go/src/github.com/mjarkk/wotclans /wotclans
WORKDIR /wotclans/web_static
RUN npm i && npm run build

FROM alpine

RUN apk add ca-certificates libwebp libwebp-tools \
  && mkdir /wotclans \
  && mkdir /wotclans/web_static \
  && mkdir /wotclans/vendor \
  && mkdir /wotclans/vendor/webp \
  && cp /usr/bin/cwebp /wotclans/vendor/webp/cwebp \
  && cp /usr/bin/dwebp /wotclans/vendor/webp/dwebp \
  && cp /usr/bin/gif2webp /wotclans/vendor/webp/gif2webp \
  && cp /usr/bin/img2webp /wotclans/vendor/webp/img2webp \
  && cp /usr/bin/webpinfo /wotclans/vendor/webp/webpinfo \
  && cp /usr/bin/webpmux /wotclans/vendor/webp/webpmux

COPY --from=buildWeb /wotclans/wotclans /wotclans/wotclans
COPY --from=buildWeb /wotclans/icons /wotclans/icons
COPY --from=buildWeb /wotclans/community.json /wotclans/community.json
COPY --from=buildWeb /wotclans/web_static/build /wotclans/web_static/build
COPY --from=buildWeb /wotclans/web_static/manifest.json /wotclans/web_static/manifest.json
COPY ./config.json /wotclans/config.json

WORKDIR /wotclans
EXPOSE 8282

CMD ./wotclans
