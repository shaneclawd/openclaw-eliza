#!/bin/bash
# Initialize git submodules if .git exists
if [ -d ".git" ]; then
    echo "Initializing git submodules..."
    git submodule update --init --recursive || true
else
    echo "No .git directory found, skipping submodule init"
fi