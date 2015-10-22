SHELL = /bin/sh

ISTANBUL = ./node_modules/.bin/istanbul
JSHINT = ./node_modules/.bin/jshint
MOCHA = ./node_modules/.bin/_mocha

SRC = cli.js index.js lib/*.js

.SUFFIXES:

.PHONY: all
all :

.PHONY: test
test : install-deps
	@$(ISTANBUL) cover $(MOCHA) -- --compilers coffee:coffee-script --require coffee-script/register test/*.coffee ; true
	@$(JSHINT) $(SRC) ; true

.PHONY: install-deps
install-deps :
	npm install

.PHONY: install
install :
	npm install -g

.PHONY: uninstall
uninstall :
	npm uninstall -g lambda-calculator.js

.PHONY: clean
clean :
	rm -rf coverage

.PHONY: distclean
distclean : clean
	rm -rf node_modules
