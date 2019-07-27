# Build the server binary
FROM amd64/golang:alpine as buildServer

# Copy over the files
RUN mkdir -p /go/src/github.com/mjarkk/wotnlclans
WORKDIR /go/src/github.com/mjarkk/wotnlclans
COPY ./ ./

# build the program
RUN GOOS=linux GARCH=amd64 CGO_ENABLED=0 go build -v -a -installsuffix cgo

FROM amd64/alpine as getWebp

RUN apk add wget \
  && mkdir /webp \
  && wget http://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.0.3-linux-x86-64.tar.gz \
  && tar xf libwebp-1.0.3-linux-x86-64.tar.gz -C /webp

# Build the javascript files
FROM node:alpine as buildWeb

# Copy over the current state from 
COPY --from=buildServer /go/src/github.com/mjarkk/wotnlclans /wotnlclans
WORKDIR /wotnlclans/web_static
RUN yarn && yarn build

FROM amd64/alpine

RUN apk add ca-certificates && mkdir /wotnlclans && mkdir /wotnlclans/web_static && mkdir /wotnlclans/vendor

COPY --from=buildWeb /wotnlclans/wotnlclans /wotnlclans/wotnlclans
COPY --from=buildWeb /wotnlclans/icons /wotnlclans/icons
COPY --from=buildWeb /wotnlclans/community.json /wotnlclans/community.json
COPY --from=buildWeb /wotnlclans/web_static/build /wotnlclans/web_static/build
COPY --from=buildWeb /wotnlclans/web_static/manifest.json /wotnlclans/web_static/manifest.json
COPY --from=getWebp /webp/libwebp-1.0.3-linux-x86-64/bin /wotnlclans/vendor/webp

WORKDIR /wotnlclans
EXPOSE 8282

CMD ./wotnlclans
