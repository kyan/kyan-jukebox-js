files = -f docker-compose.yml

help:
	@echo "How to use:"
	@echo
	@echo "  $$ make build              build Client and API images"
	@echo "  $$ make build-all          build Client, API and Mopidy images"
	@echo "  $$ make serve              start the local development environment with Client and API"
	@echo "  $$ make serve-all          start the local development environment with Client, API and Mopidy"
	@echo "  $$ make stop-all           stop all local development environment"
	@echo "  $$ make client-test        runs client specs in watch mode with coverage"
	@echo "  $$ make client-console     gives you a shell into the app"
	@echo "  $$ make api-test           runs api specs in watch mode with coverage"
	@echo "  $$ make api-console        gives you a shell into the app"
	@echo "  $$ make api-lint           runs ESlint without fixing anything"
	@echo "  $$ make api-fix            runs ESlint with --fix and --quiet"
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

client-test:
	docker-compose run --rm jukebox-client npm test --coverage

client-console:
	docker-compose run --rm jukebox-client sh

api-test:
	docker-compose run --rm jukebox-api npm run test:coverage

api-console:
	docker-compose run --rm jukebox-api sh

api-lint:
	docker-compose run --rm jukebox-api npm run lint

api-fix:
	docker-compose run --rm jukebox-api npm run fix

test:
	docker-compose run -e CI=true --rm jukebox-client npm test -- --coverage --runInBand
	docker-compose run -e CI=true --rm jukebox-api npm run test:ci
