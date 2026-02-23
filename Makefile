# ==============================================================================
# Makefile — Docker project with www and www-with-bun services
# Usage: make <target> [SERVICE=<service>]
# ==============================================================================

# --- Config -------------------------------------------------------------------
COMPOSE_FILE    := compose.yml
DOCKER_COMPOSE  := docker compose -f $(COMPOSE_FILE)

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
	@echo "  Services:  www-with-bun | web | api | shared"
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


# ==============================================================================
# Status
# ==============================================================================

.PHONY: ps
ps: ## Show running containers and their status
	$(DOCKER_COMPOSE) ps

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
	docker compose -f compose.yml -f compose.dev.yml up

.PHONY: dev-build
dev-build: ## Rebuild dev image then start
	docker compose -f compose.yml -f compose.dev.yml up --build

# ==============================================================================
# Dev helpers
# ==============================================================================

.PHONY: pull
pull: ## Pull latest base images
	$(DOCKER_COMPOSE) pull

.PHONY: config
config: ## Validate and print the resolved docker-compose config
	$(DOCKER_COMPOSE) config