# Define variables for directories
API_DIR=api
PRISMA_DIR=api/prisma
UI_DIR=front

.PHONY: up server front clean setup

# Default target
up:
	@echo "Starting all services..."
	$(MAKE) server &
	$(MAKE) front &
	@echo "All services started."

# Start the server from the API folder
server:
	@echo "Starting server..."
	cd $(API_DIR) && npm start

# Start the UI from the UI folder
front:
	@echo "Starting UI..."
	cd $(UI_DIR) && npm run dev


# Setup function to install dependencies and set up Prisma
setup:
	@echo "Installing dependencies for API..."
	cd $(API_DIR) && npm install --force
	@echo "Installing dependencies for UI..."
	cd $(UI_DIR) && npm install --force
	@echo "Setting up Prisma..."
	cd $(PRISMA_DIR) && npx prisma generate && npx prisma db push
	@echo "Seeding database with mocked data..."
	node $(PRISMA_DIR)/seed.mjs
	@echo "Setup complete."

# Clean function to stop all processes
clean:
	@echo "Stopping all processes..."
	pkill -f "npm start" || true
	pkill -f "npm run dev" || true
	@echo "All processes stopped."