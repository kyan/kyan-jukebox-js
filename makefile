files = -f docker-compose.yml

help:
	@echo "How to use:"
	@echo
	@echo "  $$ make build              build mongoDB and Mopidy images"
	@echo "  $$ make serve              start mongoDB and Mopidy"
	@echo "  $$ make stop-all           stop all local development environment"
	@echo "  $$ make fe                 runs frontend scripts (e.g args=lint)"
	@echo "  $$ make be                 runs backend scripts (e.g args=lint)"
	@echo "  $$ make fe-test            runs ALL frontend tests (use args= for any args)"
	@echo "  $$ make be-test            runs ALL backend tests (use args= for any args)"
	@echo "  $$ make test               runs ALL tests (same as on CI)"
	@echo "  $$ make fe-deploy          production deploy of frontend to Github"
	@echo "  $$ make be-deploy          production deploy of backend using dist/ dir"

build:
	docker-compose $(files) down
	docker-compose $(files) build

serve:
	docker-compose $(files) $(args) up

stop-all:
	docker-compose $(files) down

fe:
	yarn workspace @jukebox/frontend $(task)

be:
	yarn workspace @jukebox/backend $(task)

fe-test:
	yarn workspace @jukebox/backend test $(args)

be-test:
	yarn workspace @jukebox/backend test $(args)

test:
	CI=true yarn workspace @jukebox/frontend test:ci
	CI=true yarn workspace @jukebox/backend test:ci

fe-deploy:
	./scripts/deploy-frontend.sh

be-deploy:
	./scripts/deploy-backend.sh
