.PHONY: all 

all: build-client start-server

install-client: 
	cd client && npm install 

install-server: 
	cd server && npm install 

build-client: install-client 
	cd client && ./node_modules/.bin/webpack 

start-server: install-server 
	cd server && nodemon 