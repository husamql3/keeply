# ==============================================================================
# Makefile — Docker project with www, web, and api services
# Usage: make <target> [SERVICE=<service>]
# ==============================================================================

# --- Config -------------------------------------------------------------------
COMPOSE_FILE    := compose.yml
COMPOSE_DEV_FILE:= compose.dev.yml
DOCKER_COMPOSE  := docker compose -f $(COMPOSE_FILE)
DOCKER_COMPOSE_DEV := docker compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE)

# Default service (override with: make build SERVICE=api)
SERVICE         ?=

# Colours for pretty output
CYAN  := \033[0;36m
RESET := \033[0m


# ==============================================================================
# Help
# ==============================================================================

.PHONY: help
help: ## Show this help message
	@echo ""
	@echo "  $(CYAN)Usage:$(RESET)  make <target> [SERVICE=<service-name>]"
	@echo ""
	@echo "  Services:  www | web | api"
	@echo ""
	@echo "  Dev Commands:"
	@echo "    dev, dev-build, dev-api, dev-web, dev-www"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""


# ==============================================================================
# Build
# ==============================================================================

.PHONY: build
build: ## Build image(s). Use SERVICE= to target one service
	$(DOCKER_COMPOSE) build $(SERVICE)

.PHONY: build-no-cache
build-no-cache: ## Build with no cache (useful when deps change)
	$(DOCKER_COMPOSE) build --no-cache $(SERVICE)

.PHONY: build-bun
build-bun: ## Build only the www-with-bun service
	$(DOCKER_COMPOSE) build www-with-bun

.PHONY: build-web
build-web: ## Build only the web service
	$(DOCKER_COMPOSE) build web

.PHONY: build-api
build-api: ## Build only the api service
	$(DOCKER_COMPOSE) build api

.PHONY: build-dev
build-dev: ## Build dev images (using compose.dev.yml)
	$(DOCKER_COMPOSE_DEV) build

.PHONY: build-dev-api
build-dev-api: ## Build only api dev image
	$(DOCKER_COMPOSE_DEV) build api

.PHONY: build-dev-web
build-dev-web: ## Build only web dev image
	$(DOCKER_COMPOSE_DEV) build web

.PHONY: build-dev-www
build-dev-www: ## Build only www dev image
	$(DOCKER_COMPOSE_DEV) build www


# ==============================================================================
# Run / Start
# ==============================================================================

.PHONY: up
up: ## Start all services in detached mode
	$(DOCKER_COMPOSE) up -d

.PHONY: up-build
up-build: ## Build then start all services in detached mode
	$(DOCKER_COMPOSE) up -d --build

.PHONY: up-bun
up-bun: ## Start only www-with-bun
	$(DOCKER_COMPOSE) up -d www-with-bun

.PHONY: up-web
up-web: ## Start only web
	$(DOCKER_COMPOSE) up -d web

.PHONY: up-api
up-api: ## Start only api
	$(DOCKER_COMPOSE) up -d api

.PHONY: start
start: ## Alias for `up`
	$(MAKE) up


# ==============================================================================
# Stop / Down
# ==============================================================================

.PHONY: down
down: ## Stop and remove containers (keeps volumes & images)
	$(DOCKER_COMPOSE) down

.PHONY: down-v
down-v: ## Stop and remove containers AND volumes (⚠ deletes data)
	$(DOCKER_COMPOSE) down -v

.PHONY: down-dev
down-dev: ## Stop and remove dev containers (keeps volumes & images)
	$(DOCKER_COMPOSE_DEV) down

.PHONY: down-dev-v
down-dev-v: ## Stop and remove dev containers AND volumes
	$(DOCKER_COMPOSE_DEV) down -v

.PHONY: stop
stop: ## Stop containers without removing them
	$(DOCKER_COMPOSE) stop $(SERVICE)

.PHONY: restart
restart: ## Restart all (or one) service(s)
	$(DOCKER_COMPOSE) restart $(SERVICE)


# ==============================================================================
# Logs
# ==============================================================================

.PHONY: logs
logs: ## Tail logs for all (or one) service(s). Use SERVICE= to filter
	$(DOCKER_COMPOSE) logs -f $(SERVICE)

.PHONY: logs-bun
logs-bun: ## Tail logs for www-with-bun only
	$(DOCKER_COMPOSE) logs -f www-with-bun

.PHONY: logs-api
logs-api: ## Tail logs for api only
	$(DOCKER_COMPOSE) logs -f api

.PHONY: logs-dev
logs-dev: ## Tail logs for all dev services
	$(DOCKER_COMPOSE_DEV) logs -f

.PHONY: logs-dev-api
logs-dev-api: ## Tail logs for api dev service only
	$(DOCKER_COMPOSE_DEV) logs -f api


# ==============================================================================
# Shell / Exec
# ==============================================================================

.PHONY: shell
shell: ## Open a shell inside a running container. Requires SERVICE=<name>
ifndef SERVICE
	$(error SERVICE is required. E.g: make shell SERVICE=api)
endif
	$(DOCKER_COMPOSE) exec $(SERVICE) sh

.PHONY: shell-bun
shell-bun: ## Open a shell inside www-with-bun
	$(DOCKER_COMPOSE) exec www-with-bun sh

.PHONY: shell-api
shell-api: ## Open a shell inside api
	$(DOCKER_COMPOSE) exec api sh

.PHONY: shell-dev-api
shell-dev-api: ## Open a shell inside api dev container
	$(DOCKER_COMPOSE_DEV) exec api sh


# ==============================================================================
# Status
# ==============================================================================

.PHONY: ps
ps: ## Show running containers and their status
	$(DOCKER_COMPOSE) ps

.PHONY: ps-dev
ps-dev: ## Show running dev containers and their status
	$(DOCKER_COMPOSE_DEV) ps

.PHONY: stats
stats: ## Live resource usage (CPU, RAM) for all containers
	docker stats


# ==============================================================================
# Cleanup
# ==============================================================================

.PHONY: clean
clean: down ## Stop containers and remove project images
	$(DOCKER_COMPOSE) down --rmi local

.PHONY: clean-all
clean-all: ## ⚠ Full purge: containers, volumes, images, build cache
	$(DOCKER_COMPOSE) down -v --rmi all
	docker builder prune -f

.PHONY: prune
prune: ## Remove unused Docker system resources (global)
	docker system prune -f

.PHONY: dev
dev: ## Start all services in development mode (live reload)
	$(DOCKER_COMPOSE_DEV) up

.PHONY: dev-build
dev-build: ## Rebuild dev image then start
	$(DOCKER_COMPOSE_DEV) up --build

.PHONY: dev-api
dev-api: ## Start only api in development mode (with live reload)
	$(DOCKER_COMPOSE_DEV) up api

.PHONY: dev-api-build
dev-api-build: ## Rebuild and start only api in development mode
	$(DOCKER_COMPOSE_DEV) up api --build

.PHONY: dev-web
dev-web: ## Start only web in development mode (with live reload)
	$(DOCKER_COMPOSE_DEV) up web

.PHONY: dev-www
dev-www: ## Start only www in development mode (with live reload)
	$(DOCKER_COMPOSE_DEV) up www

# ==============================================================================
# Dev helpers
# ==============================================================================

.PHONY: pull
pull: ## Pull latest base images
	$(DOCKER_COMPOSE) pull

.PHONY: config
config: ## Validate and print the resolved docker-compose config
	$(DOCKER_COMPOSE) config