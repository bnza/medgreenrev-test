#!/bin/bash
set -e
# Install the dependencies in Node environment
npm install

# npx playwright install chromium
exec docker-entrypoint "$@"