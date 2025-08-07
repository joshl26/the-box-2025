#!/bin/bash

# Define the target directory where the repository will be cloned
TARGET_DIR="/home/josh/the-box-2025"

# Define the GitHub repository URL
GITHUB_REPO_URL="github.com/joshl26/the-box-2025.git"

# Define the Github access token
GITHUB_TOKEN="https://oauth2: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"

# --- Script Execution ---

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

echo "Cloning .env file into $TARGET_DIR"
# Clone the .env file
cp .env-the-box-2025 "$TARGET_DIR"/.env

# Check if the cloning was successful
if [ $? -eq 0 ]; then
    echo ".env file cloned successfully."
else
    echo "Error cloning .env file. Exiting."
    exit 1
fi

echo"Navigate into $TARGET_DIRECTORY and run npm i --legacy-peer-deps"
# Navigate and run npm i --legacy-peer-deps
cd "$TARGET_DIR"

npm i --legacy-peer-deps

pm2 delete -s [the-box-2025] || :

pm2 start npm --name "the-box-2025" -- start

pm2 startup systemd

pm2 save

echo "Script completed."