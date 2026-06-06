.PHONY: help serve serve-py version

PORT ?= 8080

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-12s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

serve: ## Run dev server with live reload (requires Node)
	npx live-server --port=$(PORT)

serve-py: ## Run static server with Python (no live reload)
	python3 -m http.server $(PORT)

version: ## Bump patch version (requires Node)
	node update-version.js
