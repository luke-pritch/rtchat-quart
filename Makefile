.PHONY: analyze clean

# Default target
all: analyze

# Generate repository structure analysis
analyze:
	@echo "Generating repository structure analysis..."
	@echo "# Repository Structure Analysis" > repo-analysis.md
	@echo "Generated on: $$(date)" >> repo-analysis.md
	@echo "\n## Directory Structure\n" >> repo-analysis.md
	@echo "\`\`\`" >> repo-analysis.md
	@tree -I 'node_modules|.git|.astro|dist|__pycache__|.pytest_cache|.venv|.env|package-lock.json|pnpm-lock.yaml' >> repo-analysis.md
	@echo "\`\`\`" >> repo-analysis.md
	@echo "\n## Key Files\n" >> repo-analysis.md
	@echo "\`\`\`" >> repo-analysis.md
	@find . -type f -not -path "*/\.*" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/__pycache__/*" -not -path "*/.venv/*" -not -name "package-lock.json" -not -name "pnpm-lock.yaml" | sort >> repo-analysis.md
	@echo "\`\`\`" >> repo-analysis.md
	@echo "\n## Source Code\n" >> repo-analysis.md
	@echo "### Frontend Source\n" >> repo-analysis.md
	@echo "\`\`\`typescript" >> repo-analysis.md
	@cat frontend/src/components/Chat.tsx >> repo-analysis.md
	@echo "\n### Backend Source\n" >> repo-analysis.md
	@echo "\`\`\`python" >> repo-analysis.md
	@cat backend/app.py >> repo-analysis.md
	@echo "\n## Dependencies\n" >> repo-analysis.md
	@echo "### Frontend Dependencies\n" >> repo-analysis.md
	@echo "\`\`\`json" >> repo-analysis.md
	@cat frontend/package.json >> repo-analysis.md
	@echo "\n### Backend Dependencies\n" >> repo-analysis.md
	@echo "\`\`\`toml" >> repo-analysis.md
	@cat backend/Pipfile >> repo-analysis.md
	@echo "\n## Environment Variables\n" >> repo-analysis.md
	@echo "### Frontend (.env)\n" >> repo-analysis.md
	@if [ -f frontend/.env ]; then cat frontend/.env >> repo-analysis.md; else echo "No frontend .env file found" >> repo-analysis.md; fi
	@echo "\n### Backend (.env)\n" >> repo-analysis.md
	@if [ -f backend/.env ]; then cat backend/.env >> repo-analysis.md; else echo "No backend .env file found" >> repo-analysis.md; fi
	@echo "\nAnalysis complete! Check repo-analysis.md for details."

# Clean generated files
clean:
	rm -f repo-analysis.md

# Help command
help:
	@echo "Available commands:"
	@echo "  make analyze  - Generate repository structure analysis"
	@echo "  make clean    - Remove generated analysis file"
	@echo "  make help     - Show this help message" 