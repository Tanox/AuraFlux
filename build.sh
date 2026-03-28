#!/bin/bash

# 检查 npm 是否存在
if command -v npm &> /dev/null; then
    echo "npm found, installing dependencies..."
    npm install
    
    # 检查 next 是否存在
    if command -v next &> /dev/null; then
        echo "next found, building project..."
        next build
    else
        echo "next not found, using npx..."
        npx next build
    fi
else
    echo "npm not found, trying yarn..."
    if command -v yarn &> /dev/null; then
        echo "yarn found, installing dependencies..."
        yarn install
        echo "building project..."
        yarn build
    else
        echo "Error: Neither npm nor yarn found"
        exit 1
    fi
fi