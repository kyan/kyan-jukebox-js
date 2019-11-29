help:
	@echo "How to use:"
	@echo
	@echo "  $$ make build					builds images excluding local mopidy"
	@echo "  $$ make build-all			builds images including local mopidy"
	@echo "  $$ make serve    			start the local development environment excluding local mopidy"
	@echo "  $$ make serve-all    	start the local development environment including local mopidy"
	@echo "  $$ make test-frontend  runs client specs"
	@echo "  $$ make test-backend  	runs api specs"

build:
	docker-compose down
	docker-compose build

build-all:
	docker-compose -f docker-compose.yml -f docker-compose-mopidy.yml build

serve:
	docker-compose up

serve-all:
	docker-compose -f docker-compose.yml -f docker-compose-mopidy.yml up

test-frontend:
	./scripts/specs-client.sh

test-backend:
	./scripts/specs-api.sh
