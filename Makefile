# Matomo React Native - Development Makefile
# Enhanced TypeScript package for React Native Matomo tracking

.PHONY: help install clean build test type-check lint format publish dev test-production

# Default target
help: ## Show this help message
	@echo "Matomo React Native - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Setup
install: ## Install dependencies
	npm install

clean: ## Clean node_modules and build artifacts
	rm -rf node_modules
	rm -rf dist
	rm -rf *.tsbuildinfo
	npm cache clean --force

reinstall: clean install ## Clean reinstall of dependencies

# Build and Compilation
build: ## Build TypeScript to JavaScript
	npx tsc

build-watch: ## Build TypeScript in watch mode
	npx tsc --watch

type-check: ## Run TypeScript type checking
	npx tsc --noEmit

# Testing
test: ## Run test suite
	cd tests && node simple-test.js

test-production: ## Run tests against production Matomo instance
	@echo "Running tests against production Matomo instance..."
	cd tests && node simple-test.js

test-verbose: ## Run tests with verbose output
	cd tests && node simple-test.js --verbose

# Code Quality
lint: ## Run ESLint (if configured)
	@if [ -f .eslintrc.js ] || [ -f .eslintrc.json ]; then \
		npx eslint src/ --ext .ts,.tsx; \
	else \
		echo "ESLint not configured. Run 'make setup-lint' to configure."; \
	fi

format: ## Format code with Prettier (if configured)
	@if [ -f .prettierrc ] || [ -f prettier.config.js ]; then \
		npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}"; \
	else \
		echo "Prettier not configured. Run 'make setup-format' to configure."; \
	fi

# Development Tools Setup
setup-lint: ## Setup ESLint for TypeScript
	npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint
	@echo "ESLint installed. Create .eslintrc.js manually for configuration."

setup-format: ## Setup Prettier for code formatting
	npm install --save-dev prettier
	@echo "Prettier installed. Create .prettierrc manually for configuration."

# Package Management
version-patch: ## Bump patch version (1.0.0 -> 1.0.1)
	npm version patch

version-minor: ## Bump minor version (1.0.0 -> 1.1.0)
	npm version minor

version-major: ## Bump major version (1.0.0 -> 2.0.0)
	npm version major

# Publishing
publish-dry: ## Dry run npm publish
	npm publish --dry-run

publish: build ## Build and publish to npm
	@echo "Building package..."
	@make build
	@echo "Publishing to npm..."
	npm publish
	@echo "Package published successfully!"

publish-beta: build ## Publish beta version
	npm publish --tag beta

# Package Information
info: ## Show package info from npm registry
	npm view matomo-react-native

info-local: ## Show local package.json info
	@echo "Package: $$(node -p "require('./package.json').name")"
	@echo "Version: $$(node -p "require('./package.json').version")"
	@echo "Description: $$(node -p "require('./package.json').description")"

# Development Utilities
dev: ## Start development environment
	@echo "Starting TypeScript compiler in watch mode..."
	make build-watch

check-updates: ## Check for dependency updates
	npm outdated

update-deps: ## Update dependencies
	npm update

# Git Utilities
git-status: ## Show git status
	git status

git-push: ## Push to git repository
	git add .
	git commit -m "Update package"
	git push

# Documentation
docs: ## Generate documentation (placeholder)
	@echo "Documentation generation not yet configured."
	@echo "Consider adding typedoc: npm install --save-dev typedoc"

# Package Analysis
analyze: ## Analyze package size
	@echo "Package contents:"
	npm pack --dry-run
	@echo ""
	@echo "Estimated package size:"
	@du -sh . 2>/dev/null | head -1 || echo "Size calculation not available"

# Quick Development Workflow
quick-test: type-check test ## Quick type check and test
	@echo "✅ Quick development check completed"

quick-publish: type-check test build publish ## Full pipeline: check, test, build, publish
	@echo "🚀 Package published successfully through full pipeline"

# Environment Info
env-info: ## Show development environment information
	@echo "Node.js version: $$(node --version)"
	@echo "npm version: $$(npm --version)"
	@echo "TypeScript version: $$(npx tsc --version)"
	@echo "Current directory: $$(pwd)"
	@echo "Package name: $$(node -p "require('./package.json').name")"
	@echo "Package version: $$(node -p "require('./package.json').version")"