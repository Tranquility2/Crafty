.PHONY: help serve serve-py serve-bg stop-bg restart-bg status-bg logs-bg version version-minor version-major push

PORT ?= 8080

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

serve: ## Run dev server with live reload (foreground, requires Node)
	npx live-server --port=$(PORT) --no-browser

serve-py: ## Run static server with Python (no live reload)
	python3 -m http.server $(PORT)

serve-bg: ## Start dev server in background
	@./scripts/devserver.sh start $(PORT)

stop-bg: ## Stop background dev server
	@./scripts/devserver.sh stop

restart-bg: ## Restart background dev server
	@./scripts/devserver.sh restart $(PORT)

status-bg: ## Show background dev server status
	@./scripts/devserver.sh status

logs-bg: ## Tail background dev server logs
	@./scripts/devserver.sh logs

version: ## Bump patch version: commit + tag (requires Node)
	npm version patch

version-minor: ## Bump minor version: commit + tag (requires Node)
	npm version minor

version-major: ## Bump major version: commit + tag (requires Node)
	npm version major

push: ## Push commits and tags to the remote
	git push --follow-tags
