#!/bin/bash

sudo apt update && sudo apt upgrade -y

# Add PostgreSQL official APT repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update package database
sudo apt update

# Install PostgreSQL 16
sudo apt install postgresql-16 postgresql-client-16 postgresql-contrib-16 postgresql-server-dev-16 -y

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_secure_password';"


# Add TimescaleDB repository (using jammy for compatibility)
sudo sh -c "echo 'deb [signed-by=/usr/share/keyrings/timescaledb.gpg] https://packagecloud.io/timescale/timescaledb/ubuntu/ jammy main' > /etc/apt/sources.list.d/timescaledb.list"

# Add GPG key
wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor | sudo tee /usr/share/keyrings/timescaledb.gpg >/dev/null

# Update package list
sudo apt update

# Install TimescaleDB
sudo apt install timescaledb-2-postgresql-16 -y

# Run TimescaleDB configuration script
sudo timescaledb-tune --quiet --yes

# Edit PostgreSQL configuration to preload TimescaleDB
sudo nano /etc/postgresql/16/main/postgresql.conf

# Find and modify the shared_preload_libraries line:
# shared_preload_libraries = 'timescaledb'

sudo systemctl restart postgresql

# Connect to PostgreSQL
sudo -u postgres psql

# Create the TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

# Check version
SELECT extname, extversion FROM pg_extension WHERE extname = 'timescaledb';

# Exit
\q

# Check PostgreSQL version
sudo -u postgres psql -c "SELECT version();"

# Check TimescaleDB extension
sudo -u postgres psql -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'timescaledb';"

# Test creating a hypertable
sudo -u postgres psql << EOF
CREATE DATABASE test_ts;
\c test_ts;
CREATE EXTENSION timescaledb;
CREATE TABLE test_table (time TIMESTAMPTZ NOT NULL, value DOUBLE PRECISION);
SELECT create_hypertable('test_table', 'time');
\q
EOF

sudo systemctl restart postgresql
sudo systemctl status postgresql