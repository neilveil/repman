start:
	@node index.js

clean:
	@rm -rf dst

build-linux:
	@npx pkg index.js --targets node14-linux-x64 --output dst/linux

build-windows:
	@npx pkg index.js --targets node14-win-x64 --output dst/windows

build-macos:
	@npx pkg index.js --targets node14-macos-x64 --output dst/macos

build: clean build-linux build-windows build-macos

install: build-linux
	@sudo cp dst/linux /usr/bin/repman
	@echo Installed!
