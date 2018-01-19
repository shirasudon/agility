FROM hitochan777/golang-nodejs-docker

WORKDIR /home/node

RUN go get -u github.com/golang/dep/cmd/dep; \
    go get -u github.com/shirasudon/go-chat; \
    cd $GOPATH/src/github.com/shirasudon/go-chat; \
    dep ensure; \
    go build -o go-chat-server ./main;

COPY . /home/node/agility

RUN cd /home/node/agility; \
    yarn; \
    yarn build; \
    mv $GOPATH/src/github.com/shirasudon/go-chat/go-chat-server /home/node/agility/build;

EXPOSE 8080

ENTRYPOINT ["agility/build/go-chat-server"]
