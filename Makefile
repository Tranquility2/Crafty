.PHONY: help serve serve-py version version-minor version-major push

PORT ?= 8080

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

serve: ## Run dev server with live reload (requires Node)
	npx live-server --port=$(PORT) --no-browser

serve-py: ## Run static server with Python (no live reload)
	python3 -m http.server $(PORT)

version: ## Bump patch version: commit + tag (requires Node)
	npm version patch

version-minor: ## Bump minor version: commit + tag (requires Node)
	npm version minor

version-major: ## Bump major version: commit + tag (requires Node)
	npm version major

push: ## Push commits and tags to the remote
	git push --follow-tags
