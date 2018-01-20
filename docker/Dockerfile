FROM hitochan777/golang-nodejs-docker

ENV APP_DIR=/home/node/app

WORKDIR $APP_DIR

# Install and setup go-chat server
RUN go get -u github.com/golang/dep/cmd/dep; \
    go get -u github.com/shirasudon/go-chat; \
    cd $GOPATH/src/github.com/shirasudon/go-chat; \
    dep ensure; \
    go build -o go-chat-server ./main; \
    mkdir -p $APP_DIR

COPY . /tmp/agility

# Build client side app and move to app directory
RUN cd /tmp/agility; \
    yarn; \
    yarn build; \
    mv config/server-config.toml $APP_DIR; \
    mv build $APP_DIR/public; \
    mv $GOPATH/src/github.com/shirasudon/go-chat/go-chat-server $APP_DIR;

ENV GOCHAT_CONFIG_FILE "${APP_DIR}/server-config.toml"

EXPOSE 8080

ENTRYPOINT ["./go-chat-server"]
