#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
npm install

# Force a clean build of the frontend
npm run build

# Apply any outstanding database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input
