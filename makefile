files = -f docker-compose.yml -f docker-compose.mongo.yml

help:
	@echo "How to use:"
	@echo
	@echo "  $$ make build              build Client and API images"
	@echo "  $$ make build-all          build Client, API and Mopidy images"
	@echo "  $$ make serve              start the local development environment with Client and API"
	@echo "  $$ make serve-all          start the local development environment with Client, API and Mopidy"
	@echo "  $$ make stop-all           stop all local development environment"
	@echo "  $$ make test-client        runs client specs in watch mode"
	@echo "  $$ make coverage-client    runs client specs in watch mode with coverage"
	@echo "  $$ make test-api           runs api specs in watch mode"
	@echo "  $$ make coverage-api       runs api specs in watch mode with coverage"
	@echo "  $$ make test               runs all tests (same as on CI)"

build:
	docker-compose $(files) down
	docker-compose $(files) build

build-all:
	docker-compose $(files) -f docker-compose-mopidy.yml down
	docker-compose $(files) -f docker-compose-mopidy.yml build

serve:
	docker-compose $(files) up

serve-all:
	docker-compose $(files) -f docker-compose-mopidy.yml up

stop-all:
	docker-compose $(files) -f docker-compose-mopidy.yml down

test-client:
	docker-compose run --rm jukebox-client npm test

coverage-client:
	docker-compose run --rm jukebox-client npm test --coverage

test-api:
	docker-compose run --rm jukebox-api npm run test:watch

coverage-api:
	docker-compose run --rm jukebox-api npm run test:watch --coverage

test:
	docker-compose run -e CI=true --rm jukebox-client npm test -- --coverage --runInBand
	docker-compose run -e CI=true --rm jukebox-api npm run test:ci
