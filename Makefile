MOCHA?=node_modules/.bin/mocha
REPORTER?=dot
FLAGS=--harmony --reporter $(REPORTER)

test:
	@NODE_ENV="test" \
        $(MOCHA) $(FLAGS)

test-debug:
	@NODE_ENV="test" \
	$(MOCHA) $(FLAGS) --debug-brk

.PHONY: test
