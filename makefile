start:
	@node index.js

build:
	@rm -rf dst
	@npx pkg index.js --targets node14-linux-x64 --out-path dst

install: build
	@sudo cp dst/index /usr/bin/repman
