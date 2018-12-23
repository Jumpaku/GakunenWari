#!/bin/ash
rm -rf dist/*
cp -rf www/* dist
npm run build