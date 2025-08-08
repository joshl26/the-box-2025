#!/bin/bash

# Define the target directory where the repository will be cloned
TARGET_DIR="/home/josh/the-box-2025"

# Define the GitHub repository URL
GITHUB_REPO_URL="github.com/joshl26/the-box-2025.git"

# Define the Github access token
GITHUB_TOKEN="https://oauth2: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"

# --- Script Execution ---

echo "Stopping and deleting all PM2 processes..."
# Stop all PM2 processes first, then delete them
pm2 stop all || :
pm2 delete all || :

# Flush PM2 logs and reset
pm2 flush || :

echo "Deleting existing directory: $TARGET_DIR"
# Remove the existing directory and its contents
rm -rf "$TARGET_DIR"

# Check if the deletion was successful
if [ $? -eq 0 ]; then
    echo "Directory deleted successfully."
else
    echo "Error deleting directory. Exiting."
    exit 1
fi

echo "Cloning new repository from: $GITHUB_REPO_URL into $TARGET_DIR"
# Clone the new repository
git clone "$GITHUB_TOKEN"@"$GITHUB_REPO_URL" "$TARGET_DIR"

# Check if the cloning was successful
if [ $? -eq 0 ]; then
    echo "Repository cloned successfully."
else
    echo "Error cloning repository. Exiting."
    exit 1
fi

echo "Copying .env file into $TARGET_DIR"
# Copy the .env file
cp .env-the-box-2025 "$TARGET_DIR"/.env

# Check if the copying was successful
if [ $? -eq 0 ]; then
    echo ".env file copied successfully."
else
    echo "Error copying .env file. Exiting."
    exit 1
fi

echo "Navigate into $TARGET_DIR and run npm i --legacy-peer-deps"
# Navigate and run npm i --legacy-peer-deps
cd "$TARGET_DIR"

sudo npm i --legacy-peer-deps

# Check if npm install was successful
if [ $? -eq 0 ]; then
    echo "npm install completed successfully."
else
    echo "Error during npm install. Exiting."
    exit 1
fi

npm run test_db

npm run seed

npm run build

# Delete any existing instance of "the-box-2025" specifically
echo "Ensuring no existing 'the-box-2025' PM2 processes..."
pm2 delete "the-box-2025" || :

# Start the new PM2 process
echo "Starting PM2 process..."


# Setup PM2 startup (only need to run this once, but it's idempotent)
pm2 startup systemd

# Save the current PM2 process list
pm2 save --force

echo "Script completed."
echo "PM2 status:"
pm2 status