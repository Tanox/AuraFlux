#!/bin/bash

echo "Testing npm installation..."
npm --version
echo "Testing node installation..."
node --version
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Trying to install next globally..."
npm install -g next
echo "Next version:"
next --version